import React, {Component} from 'react';
//демонстрация возможностей импорта функций
import Total /*имя может быть любым, без фигурных скобок т.к export default*/ from './components/total/Total';
import {History} /*имя строго, фигурные скобки, т.к export default*/ from './components/history/History';
import Operations /*имя может быть любым, без фигурных скобок, т.к export default*/ from './components/operation/Operation';

class App extends Component { //классы позволяют хранить состояния

  constructor(props) { //здесь хранятся состояния
    super(props);
    this.state = {
      transactions: [],
      description: '',
      moneyAmount: '',
    }
    this.addAmount = this.addAmount.bind(this); //решение проблемы с setState undefined
  }

  //именно этот метод мы передаем в Operation
  addTransaction(add) {
    const transaction = {
      id: `cmr${(+new Date).toString(16)}key`, //+ перед new Date нужен чтобы дата сразу переводилась в число. 16 переводит число в шестнадцатеричную систему
      description: this.state.description,
      moneyAmount: this.state.moneyAmount,
      add
    }
  }

  addAmount(e) { //это асинхронная функция
    this.setState({moneyAmount: e.target.value}, /*далее идёт callback-функция(действие после)*/ ()=>{console.log(this.state)}) 
  }

  addDescription(e) { //это асинхронная функция
    this.setState({description: e.target.value}) 
  }

  render() {
    return (
      /*эти треугольные скобки могут быть пустыми, т.к по умолчанию и так стоит React.Fragment*/
      <React.Fragment> 
        <header>
          <h1>Кошелек</h1>
          <h2>Калькулятор расходов</h2>
        </header>
        <main>
            <div className="container">
                <Total/>
                <History/>
                <Operations 
                  addTransaction={this.addTransaction}
                  addAmount={this.addAmount}
                />
            </div>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
