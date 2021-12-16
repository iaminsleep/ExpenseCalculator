import React from 'react';
import firebase from './firebase-config';

const Auth = ({App}) => {

  let currentUser = {
    username: '',
    accessToken: '',
  };

  const SignInWithFirebase = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(res => {

        const resUsername = res.additionalUserInfo.username;
        const resToken = res.user.multiFactor.user.accessToken;
        currentUser.username = resUsername;
        currentUser.accessToken = resToken;
        
        firebase.database().ref("users").set({currentUser}).catch(alert);
        checkIfSignedIn();

        localStorage.setItem("expcalc:token", resToken);
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

  return (
    <button onClick={SignInWithFirebase}>Войти</button>
  )

}

export default Auth;