import React, {Component} from 'react';
//демонстрация возможностей импорта функций
import Total /*имя может быть любым, без фигурных скобок т.к export default*/ from './components/total/Total';
import {History} /*имя строго, фигурные скобки, т.к export default*/ from './components/history/History';
import Operations /*имя может быть любым, без фигурных скобок, т.к export default*/ from './components/operation/Operation';

class App extends Component { //классы позволяют хранить состояния

  state = {
    transactions: [],
    description: '',
    moneyAmount: '',
  }

  //именно этот метод мы передаем в Operation
  addTransaction = add => {
    const transactions = [...this.state.transactions]; //... - spread-оператор

    transactions.push({ //пушим новую транзакцию
      id: `cmr${(+new Date).toString(16)}key`, //+ перед new Date нужен чтобы дата сразу переводилась в число. 16 переводит число в шестнадцатеричную систему
      description: this.state.description,
      moneyAmount: this.state.moneyAmount,
      add
    });

    this.setState({transactions, description: '', moneyAmount: ''}, () => console.log(this.state));
  }

  addAmount = e => { //это асинхронная функция
    this.setState({moneyAmount: e.target.value}) 
  }

  addDescription = e => { //это асинхронная функция
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
                <History transactions = {this.state.transactions}/>
                <Operations 
                  addTransaction={this.addTransaction}
                  addDescription={this.addDescription}
                  addAmount={this.addAmount}
                  description={this.state.description}
                  moneyAmount={this.state.moneyAmount}
                />
            </div>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
