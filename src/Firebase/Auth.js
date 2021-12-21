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

        App.setState({
          userId: resID,
          access_token: accessToken,
        }, () => {
          checkIfUserExists(resID);       
          checkIfSignedIn(accessToken);
        });
        
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const checkIfSignedIn = (access_token) => {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log('Вход в систему');
        App.setState({
          isSignedIn: true,
        });
        localStorage.setItem("expcalc:issignedin", "true");
        localStorage.setItem("expcalc:access_token", access_token);
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
      window.location.reload();
    });
  }

  return (
    <button onClick={SignInWithFirebase}>Войти</button>
  )
}

export default Auth; 