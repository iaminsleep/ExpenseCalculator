import React from 'react';

export default function Operation({addTransaction, addDescription, addAmount}) { //деструктуризировали props и получили сразу нужную функцию
  return(
      <section className="operation">
      <h3>Новая операция</h3>
      <form id="form">
          <label>
              <input 
                onChange={addDescription}
                type="text" 
                className="operation__fields operation__name" 
                placeholder="Наименование операции"
              />
          </label>
          <label>
              <input onChange={addAmount} type="number" className="operation__fields operation__amount" placeholder="Введите сумму"/>
          </label>
          <div className="operation__btns">
              <button 
                onClick={() => addTransaction(false)} 
                type="button" 
                className="operation__btn operation__btn-subtract">РАСХОД</button>
              <button 
              onClick={() => addTransaction(true)} type="button" className="operation__btn operation__btn-add">ДОХОД</button>
          </div>
      </form>
  </section>
  )
}