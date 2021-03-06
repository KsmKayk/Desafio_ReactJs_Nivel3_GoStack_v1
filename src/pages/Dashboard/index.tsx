import React, { useState, useEffect } from 'react';
import moment from "moment"

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Response {
 balance: {
    income: number;
    outcome: number;
    total: number;
  };

  transactions: [
    {
      id: string;
      title: string;
      value: number;
      type: 'income' | 'outcome';
      category: { title: string };
      created_at: Date;
    }
  ]
}

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response =  await api.get<Response>("transactions")



      let formatedTransactions = response.data.transactions.map((transaction) => {
        const formatedValue = formatValue(transaction.value)
        const formatedDate = moment(transaction.created_at, "YYYY-MM-DD hh:mm:ss.SSS").format("DD/MM/YYYY")

        const formatedTransaction: Transaction = {
          id: transaction.id,
          title: transaction.title,
          value: transaction.value,
          formattedValue: formatedValue,
          formattedDate: formatedDate,
          type: transaction.type,
          category: transaction.category,
          created_at: transaction.created_at,
        }

        return formatedTransaction
      })

      setTransactions(formatedTransactions)

      const income = formatValue(response.data.balance.income )
      const outcome = formatValue(response.data.balance.outcome )
      const total = formatValue(response.data.balance.total )

      const formatedBalance: Balance = {
        income, outcome, total
      }

      setBalance(formatedBalance)
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Sa??das</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>T??tulo</th>
                <th>Pre??o</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => {
                return(<tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>{transaction.type === "outcome" && " - "} {transaction.formattedValue}</td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>)
              })}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
