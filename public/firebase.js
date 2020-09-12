function toggleSignIn() {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
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
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
    // [END authwithemail]
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {
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
  // Create user with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END createwithemail]
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
      // User is signed in.
      document.getElementById('quickstart-sign-in-status').textContent = 'Logado';
      document.getElementById('quickstart-sign-in').textContent = 'Sair';

      console.log(document.getElementById('quickstart-sign-in-status'));

      // if (document.getElementById('quickstart-sign-in-status') === 'Logado') {
      //   window.location.replace('/cadastro.html');
      // }

    } else {
      // User is signed out.
      document.getElementById('quickstart-sign-in-status').textContent = 'Deslogado';
      document.getElementById('quickstart-sign-in').textContent = 'Acessar';
    }
    document.getElementById('quickstart-sign-in').disabled = false;

  });

  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
}