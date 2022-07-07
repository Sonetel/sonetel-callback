console.log(
  "=====================\nSonetel Callback App " +
    APP_VERSION +
    "\n====================="
);

var userId = "";
var accountId = "";
var userEmail = "";
var callOneValue = "";
var callOneSetting = "";
var userCli = "";
var userPrefCache = "";
let newWorker;
let refreshing = false;

// TO DO: Check if the user is connected to the internet. If not, show an error message.
//checkInternet();

// If the user is logged in, don't show the sign-in form.
checkSignIn();

// If the URL contains the number to call, set it as call2
getUrlParam();

/*
If there's an updated service worker available,
let the user refresh the page and activate 
the updated service worker.

Source: https://github.com/deanhume/pwa-update-available
*/
// When user clicks on reload, activate the new service worker
document.getElementById(NOTIF_RELOAD_ID).addEventListener("click", function () {
  newWorker.postMessage({ action: "skipWaiting" });
});

// The event listener that is fired when the service worker updates
// Here we reload the page
navigator.serviceWorker.addEventListener("controllerchange", function () {
  if (refreshing) return;
  window.location.reload();
  refreshing = true;
});

// Register service worker for the PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./service_worker.js")
      .then(reg => {
        console.log("Service worker: Registered");

        reg.addEventListener("updatefound", () => {
          newWorker = reg.installing;
          newWorker.addEventListener("statechange", () => {
            switch (newWorker.state) {
              case "installed":
                // New service worker available, show notification.
                if (navigator.serviceWorker.controller) {
                  toggleDisplay(NOTIF_CONTAINER_ID, "show");
                  console.log("Service worker: Updated. Reload page.");
                }
                break;
            }
          });
        });
      })
      .catch((err) => console.error("Service worker: Failed to register", err));
  });
}


document.getElementById('appInstallBtn').addEventListener('click', async () => {
  // Hide the install notification
  toggleDisplay('install-notif', "hide");

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  // Store the user's preference.
  //dismissPrompt(outcome);
  toggleDisplay('install-notif', "hide");
  deferredPrompt = null;
});

function dismissPrompt(outcome){
  window.localStorage.setItem('installPrompt',outcome);
  window.localStorage.setItem('installPromptSetTimestamp',+new Date());
}