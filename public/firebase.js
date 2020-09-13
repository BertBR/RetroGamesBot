function toggleSignIn() {
  if (firebase.auth().currentUser) {

    firebase.auth().signOut();

  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {

      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('quickstart-sign-in').disabled = false;
   
    });
    
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}

function initApp() {

  firebase.auth().onAuthStateChanged(function (user) {

    if (user) {

      document.getElementById('quickstart-sign-in-status').textContent = 'Logado';
      document.getElementById('quickstart-sign-in').textContent = 'Sair';

      if (document.getElementById('quickstart-sign-in-status').textContent === 'Logado') {
        window.location.replace('/cadastro.html');
      }

    } else {
      document.getElementById('quickstart-sign-in-status').textContent = 'Deslogado';
      document.getElementById('quickstart-sign-in').textContent = 'Acessar';
    }
    document.getElementById('quickstart-sign-in').disabled = false;

  });

  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
}