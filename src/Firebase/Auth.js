import React from 'react';
import firebase, {db}  from './firebase-config';


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

        checkIfUserExists(resID);    
        localStorage.setItem("expcalc:currentuid", JSON.stringify(resID));
        
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

  function checkIfUserExists(id) {
    db.ref("users/").orderByChild("userInfo/uid").equalTo(id).once('value').then(snapshot => {
      if(snapshot.exists()) {
        console.log('Пользователь найден в системе');
        db.ref("users").child("user"+id).update({userInfo}).catch(alert);
      }
      else {
        console.log('Добавлен новый пользователь');
        db.ref("users").child("user"+id).set({userInfo}).catch(alert);
      }
    });
  }

  return (
    <button onClick={SignInWithFirebase}>Войти</button>
  )
}

export default Auth; 