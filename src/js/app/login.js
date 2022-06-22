/*
    login.js

    Code related to user login, logout as well as token management.
    
*/
function login() {
    /* TO DO
    *
    * - send POST request to sonetel API to create token
    * - on success, store the access & refresh tokens in localStorage
    * - on failure, show error message on UI
    */

    console.log('login()');

    updateAlertMessage('w3-pale-green','<p>Login success!</p>',1500);
    window.localStorage.setItem('access_token',"sample.token");

    toggleDisplay('signin','hide');
    toggleDisplay('makecall','show');
    toggleDisplay('logoutButton','show');
    return false;
}

// Check if the user has already signed in
function checkSignIn() {

    // If the access token is already set, don't show the login screen to the user.
    if(window.localStorage.getItem('access_token')){
        console.log('logged in');
        // don't show the login form
        toggleDisplay('signin','hide');
        toggleDisplay('makecall','show');
    }else{
        console.log('not logged in');
        // show the login form
        toggleDisplay('signin','show');
        toggleDisplay('makecall','hide');
        toggleDisplay('logoutButton','hide');
    }
}

// Decode the token
function decodeJwt(token) {
    return JSON.parse(atob(token.split('.')[1]))
}

function logout() {
    console.log('logout()'); 
    toggleDisplay('signin','show');
    toggleDisplay('makecall','hide');
    toggleDisplay('logoutButton','hide');
    window.localStorage.removeItem('access_token');
}
