import React, {Component} from 'react';
//демонстрация возможностей импорта функций
import Total /*имя может быть любым, без фигурных скобок т.к export default*/ from './components/total/Total';
import {History} /*имя строго, фигурные скобки, т.к export default*/ from './components/history/History';
import Operations /*имя может быть любым, без фигурных скобок, т.к export default*/ from './components/operation/Operation';

class App extends Component { //классы позволяют хранить состояния

  state = {
    transactions: JSON.parse(localStorage.getItem("calcMoney")) || [],
    description: '',
    moneyAmount: '',
    totalIncome: 0, 
    totalExpenses: 0, 
    totalBalance: 0,
  }

  componentWillMount() { //componentWillMount вызывает функцию прямо перед началом рендеринга
    this.getTotalBalance();
  } 

  componentDidUpdate() {
    this.addToStorage(); //каждый раз, когда обновляется компонент, транзакции добавляются в локальное хранилище
  }

  //этот метод мы передаем в Operation
  addTransaction = add => {
    const transactions = [...this.state.transactions]; //... - spread-оператор

    transactions.push({ //пушим новую транзакцию
      id: `cmr${(+new Date()).toString(16)}key`, //+ перед new Date нужен чтобы дата сразу переводилась в число. 16 переводит число в шестнадцатеричную систему
      description: this.state.description,
      moneyAmount: this.state.moneyAmount,
      add
    });

    this.setState({ //почему везде пишется this? потому что эти функции и объекты находятся в одном классе (App)
      transactions, 
      description: '', 
      moneyAmount: '',
    }, this.getTotalBalance)
  }

  addAmount = e => { //это асинхронная функция
    this.setState({moneyAmount: parseFloat(e.target.value)}) //превращение строки в число
  }

  addDescription = e => { //это асинхронная функция
    this.setState({description: e.target.value}) 
  }


  getIncome() {
    return this.state.transactions
    .filter(item => item.add)
    .reduce((acc, item) => item.moneyAmount + acc, 0) 
    //reduce собирает данные, аккумулирует их. 
    //0 - значение аккумулятора по дефолту
    //если filter возвращает массив, то reduce возвращает число
  }

   //другой вариант со стрелочной функции(return не нужен) и сокращением числа итераций(функциональность та же)
  getExpenses = () => this.state.transactions
  .reduce((acc, item) => !item.add ? item.moneyAmount + acc : acc, 0);

  getTotalBalance() {
    const totalIncome = this.getIncome();
    const totalExpenses = this.getExpenses();
    const totalBalance = totalIncome - totalExpenses;

    this.setState({
      totalIncome,
      totalExpenses,
      totalBalance,
    }, () => console.log(this.state));
  }


  //Local Storage
  addToStorage() {
    localStorage.setItem("calcMoney", JSON.stringify(this.state.transactions));
  }

  deleteTransaction = id => {
    //фильтруются только те элементы, у которых ключи не совпадают с тем который мы собираемся удалить
    const transactions = this.state.transactions.filter(item => item.id !== id);
    this.setState({transactions}, this.getTotalBalance);
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
                <Total 
                  totalIncome = {this.state.totalIncome}
                  totalExpenses = {this.state.totalExpenses}
                  totalBalance = {this.state.totalBalance}
                />
                <History 
                  transactions = {this.state.transactions}
                  deleteTransaction = {this.deleteTransaction}
                />
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
