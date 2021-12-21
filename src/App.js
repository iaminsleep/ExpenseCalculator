import React, {Component} from 'react';
import Total /*имя может быть любым, без фигурных скобок т.к export default*/ from './components/total/Total';
import {History} /*имя строго, фигурные скобки, т.к НЕ export default*/ from './components/history/History';
import Operations from './components/operation/Operation';

import firebase from './Firebase/firebase-config'
import Auth from './Firebase/Auth';
import {db} from './Firebase/firebase-config';


class App extends Component { //классы позволяют хранить состояния
  
  //состояние траназкций
  state = {
    transactions: [],
    description: '',
    moneyAmount: '',
    totalIncome: 0, 
    totalExpenses: 0, 
    totalBalance: 0,
    isSignedIn: localStorage.getItem("expcalc:issignedin") && localStorage.getItem("expcalc:access_token") ? JSON.parse(localStorage.getItem("expcalc:issignedin")) : false,
    userId: '',
    access_token: localStorage.getItem("expcalc:access_token"),
  }

  componentDidMount () {
    this.getUser();
  }

  getUser() {
    const accessToken = this.state.access_token ? this.state.access_token : localStorage.getItem("expcalc:access_token");
  
    db.ref("users").orderByChild("userInfo/access_token").equalTo(accessToken).on('child_added', (snapshot) => {
      if(snapshot.exists() && accessToken !== '') {
        this.setState({
          userId: snapshot.val().userInfo.uid,
        }, () => this.getTransactions(this.state.userId));
      }
      else {
        console.error('Возникла ошибка при получении данных пользователя!');
        this.signOut();
      }
    })
  }

  getTransactions(id) {
    const userRef = db.ref("users").child("user"+id);
    userRef.once('value', snapshot => {
        this.setState({
          transactions: snapshot.val().transactions || [],
        }, () => this.getTotalBalance()) /* callback-функция (выполняется после setState) */
    });
  }

  //этот метод мы передаем в Operation
  addTransaction = add => {
    let currentUID = this.state.userId;
    const transactions = [...this.state.transactions]; //... - spread-оператор

    transactions.push({ //пушим новую транзакцию
      userId: currentUID,
      id: `cmr${(+new Date()).toString(16)}key`, //+ перед new Date нужен чтобы дата сразу переводилась в число. 16 переводит число в шестнадцатеричную систему
      description: this.state.description,
      moneyAmount: this.state.moneyAmount,
      add,
    });

    this.setState({ //почему везде пишется this? потому что эти функции и объекты находятся в одном классе (App)
      transactions, 
      description: '', 
      moneyAmount: '',
    }, () => {
      this.addToStorage(currentUID);
      this.getTotalBalance();
    });
  }

  addAmount = e => { //это асинхронная функция
    this.setState({moneyAmount: parseFloat(e.target.value)}) //превращение строки в число
  }

  addDescription = e => { //это асинхронная функция
    this.setState({description: e.target.value}) 
  }

  getIncome() {
    return this.state.transactions
    .filter(item => item.add) //если filter возвращает массив, то reduce возвращает число
    .reduce((acc, item) => item.moneyAmount + acc, 0) //reduce собирает данные, аккумулирует их. 0 - значение аккумулятора по дефолту
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
    });
  }

  //Storage
  addToStorage(id) {
    const transactions = this.state.transactions;

    db.ref("users").orderByChild("userInfo/uid").equalTo(id).once('value').then(snapshot => {
      if(snapshot.exists()) {
        const userRef = db.ref("users").child("user"+id);
        userRef.child("transactions").set(transactions);  

        console.log('Добавлена транзакция');
      }
      else {
        console.error('Возникла ошибка при получении данных!');
      }
    })
  }

  signOut = () => {
    this.setState({
      isSignedIn: false,
      userId: '',
    }, () => firebase.auth().signOut())
    localStorage.setItem("expcalc:issignedin", "false");
    console.log('Выход из системы...');
  }

  deleteTransaction = id => {
    //фильтруются только те элементы, у которых ключи не совпадают с тем который мы собираемся удалить
    const transactions = this.state.transactions.filter(item => item.id !== id);
    const userRef = db.ref("users").child("user"+this.state.userId);
 
    this.setState({transactions}, this.getTotalBalance);
    userRef.child("transactions").set(transactions);
    console.log('Транзакция удалена');
  }

  render() {
    if(this.state.isSignedIn === true) {
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
                  <button onClick={this.signOut}>Выйти</button>
              </div>
          </main>
        </React.Fragment>
      );
    }
    else {
      return(
        <React.Fragment> 
          <header>
            <h1>Кошелек</h1>
            <h2>Калькулятор расходов</h2>
          </header>
          <Auth 
            App={this}
          /> 
        </React.Fragment>
      )
    }
  }
}

export default App;
