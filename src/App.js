import React from 'react';
//демонстрация возможностей импорта функций
import Total /*имя может быть любым, без фигурных скобок т.к export default*/ from './components/total/Total';
import {History} /*имя строго, фигурные скобки, т.к export default*/ from './components/history/History';
import Operations /*имя может быть любым, без фигурных скобок, т.к export default*/ from './components/operation/Operation';

function App() {
  return (
    <>
      <header>
        <h1>Кошелек</h1>
        <h2>Калькулятор расходов</h2>
      </header>
      <main>
          <div className="container">
              <Total/>
              <History/>
              <Operations/>
          </div>
      </main>
    </>
  );
}

export default App;
