import React from 'react';
import firebase, {db}  from './firebase-config';


const Auth = ({App}) => {

  let userInfo = {
    username: '',
    uid: '',
    access_token: '',
  };

  const SignInWithFirebase = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(res => {

        const resUsername = res.additionalUserInfo.username;
        const resID = res.user.multiFactor.user.uid;
        const accessToken = res.user._delegate.accessToken;

        userInfo.username = resUsername;
        userInfo.uid = resID;
        userInfo.access_token = accessToken;

        checkIfUserExists(resID, accessToken);    
        App.setState({userId: resID});
        
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
        console.log('Успешный вход в систему');
      }
      else {
        App.setState({
          isSignedIn: false,
        });
        localStorage.setItem("expcalc:issignedin", "false");
        console.error('Вы не вошли в систему! Попробуйте ещё раз');
      }
    });
  }

  function checkIfUserExists(id, accessToken) {
    db.ref("users/").orderByChild("userInfo/uid").equalTo(id).once('value').then(snapshot => {
      if(snapshot.exists()) {
        console.log('Пользователь найден в системе');
        db.ref("users").child("user"+id).update({userInfo}).catch(alert);
        localStorage.setItem("expcalc:access_token", accessToken);
      }
      else {
        console.log('Добавлен новый пользователь');
        db.ref("users").child("user"+id).set({userInfo}).catch(alert);
        localStorage.setItem("expcalc:access_token", accessToken);
      }
    });
  }

  return (
    <button onClick={SignInWithFirebase}>Войти</button>
  )
}

export default Auth; 