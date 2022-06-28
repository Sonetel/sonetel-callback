console.log("=====================\nSonetel Callback App " + APP_VERSION + "\n=====================");

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

// Register service worker for the PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./assets/js/service_worker.js")
      .then((res) => console.log("Service worker registered"))
      .catch((err) => console.log("Cannot register service worker.", err));
  });
}
