/*
 * Sonetel Callback API JavaScript Client
 *
 * Author: Aashish
 * Email: dev.support@sonetel.com
 * Last Updated: 27 May 2022
 *
 */

const API_BASE = 'https://public-api.sonetel.com';
const AUTH_API = 'https://api.sonetel.com/SonetelAuth/beta/oauth/token';
const MSG_ID = 'messageBox';


// TO DO: Check if the user is connected to the internet. If not, show an error message.

// If the user is logged in, don't show the sign-in form.
checkSignIn();


// Register the service worker if the browser supports it.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./assets/js/service_worker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}
