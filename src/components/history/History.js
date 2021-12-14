import React from 'react';
import HistoryItem from './HistoryItem';

export const History = () => {
  return(
    <section className="history">
        <h3>История расходов</h3>
        <ul className="history__list">
            <HistoryItem/>
        </ul>
    </section>
  )
}