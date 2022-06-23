const API_BASE = 'https://public-api.sonetel.com';
const AUTH_API = 'https://api.sonetel.com/SonetelAuth/beta/oauth/token';
const MSG_ID = 'messageBox';
window.localStorage.setItem('loggedIn',false);
var userId = '';
var accountId = '';
var userEmail = '';
var callOneValue = '';
var callOneSetting = '';
var userCli = '';
var userPrefCache = '';


// TO DO: Check if the user is connected to the internet. If not, show an error message.
//checkInternet();

// If the user is logged in, don't show the sign-in form.
checkSignIn();

// If the URL contains the number to call, set it as call2
getUrlParam();

// // Set the default values from the cache if the user is logged in
// if(window.localStorage.getItem('loggedIn')){
//   
//   loadUserPref();
// }else{
//   console.log('not logged in!!');
// }


// Register service worker for the PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./assets/js/service_worker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}
