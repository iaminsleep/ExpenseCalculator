import React from 'react';
import HistoryItem from './HistoryItem';

export const History = ({transactions}) => {
  return(
    <section className="history">
        <h3>История расходов</h3>
        <ul className="history__list">
            {transactions.map(item=> /*map возвращает массив*/
              <HistoryItem 
                key={item.id}
                transaction={item}
              />)}
        </ul>
    </section>
  )
}