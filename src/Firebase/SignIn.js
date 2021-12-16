import React from 'react';
import firebase from './firebase-config';

const SignIn = ({App}) => {

  const SignInWithFirebase = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(checkIfSignedIn())
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
      }
      else {
        App.setState({
          isSignedIn: false,
        });
      }
    });
  }

  return (
    <button onClick={SignInWithFirebase}>Войти</button>
  )

}

export default SignIn;