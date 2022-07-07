/**
 * Show a custom installation prompt to the user.
 * 
 * Capture the beforeinstallprompt event and use that 
 * to show the custom app installation prompt.
 * 
 * When the user clicks on the custom prompt, they
 * see the actual prompt (and the custom prompt is hidden).
 * 
 */
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
});

function showInstallPromotion(){
  if(isMobile.phone){
    return ;
  }
  toggleDisplay('install-notif', "show");
}

document.getElementById(INSTALL_PROMPT_CLOSE_BTN).addEventListener('click',() => {
    toggleDisplay('install-notif', "hide");
});