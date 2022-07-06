// Initialize the deferred install prompt to be used later
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  if(window.localStorage.getItem('installPrompt') != 'dismissed'){
    showInstallPromotion();
  }
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});

function showInstallPromotion(){
    //document.getElementById(NOTIF_CONTAINER_ID).innerHTML=INSTALL_PROMPT;
    toggleDisplay('install-notif', "show");
    setTimeout(function () {
        toggleDisplay('install-notif', "hide");
    },10000);
    console.log('install prompt');
}

document.getElementById(INSTALL_PROMPT_CLOSE_BTN).addEventListener('click',() => {
    dismissPrompt('dismissed');
    toggleDisplay('install-notif', "hide");
});