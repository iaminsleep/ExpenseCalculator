import React from 'react';
import firebase, {dbUsers}  from './firebase-config';

const Auth = ({App}) => {

  let userInfo = {
    username: '',
    uid: '',
  };

  const SignInWithFirebase = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(res => {

        const resUsername = res.additionalUserInfo.username;
        const resID = res.user.multiFactor.user.uid;
        userInfo.username = resUsername;
        userInfo.uid = resID;
        
        checkIfUserExists(resToken);     
        checkIfSignedIn();

      })
      .catch((err) => {
        console.log(err);
      })
  }

  const checkIfSignedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        App.setState({
          isSignedIn: true,
        });
        localStorage.setItem("expcalc:issignedin", "true");
      }
      else {
        App.setState({
          isSignedIn: false,
        });
        localStorage.setItem("expcalc:issignedin", "false");
      }
    });
  }

  function checkIfUserExists(valueToCheck) {
    dbUsers.orderByChild("userInfo/accessToken").equalTo(valueToCheck)
      .once('value').then(snapshot => {
      if(snapshot.exists()) {
        console.log('Пользователь найден в системе');
      }
      else {
        dbUsers.push({userInfo}).catch(alert);
        console.log('Добавлен новый пользователь');
      }
    });
  }

  return (
    <button onClick={SignInWithFirebase}>Войти</button>
  )
}

export default Auth;