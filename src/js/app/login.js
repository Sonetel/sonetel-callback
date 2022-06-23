// Handle login to the app based on the username and password entered by the user
function login() {

  console.log("login");

  // get the token from Sonetel
  getSonetelToken().then((data) => {

    // If the token creation is successful:

    // 1. Store the access & refresh tokens.
    const accessToken = data["access_token"];
    const refreshToken = data["refresh_token"];
    window.localStorage.setItem("access_token", accessToken);
    window.localStorage.setItem("refresh_token", refreshToken);
    window.localStorage.setItem('loggedIn',true);

    // 2. Decode the token and set the userID & account IDs.
    const decodedToken = decodeJwt(accessToken);
    userId = decodedToken.user_id;
    userEmail = decodedToken.user_name;
    accountId = decodedToken.acc_id;

    // 3. Prepare to set the user's preferences
    userPrefCache = 'user_' + accountId + '_' + userId;
    callOneValue = userEmail;
    callOneSetting = 'email';
    userCli = 'automatic';

    // 4. Store the user's default preferences if they aren't already present.
    if(!window.localStorage.getItem(userPrefCache)){
        storeUserPref();
    }else{
        loadUserPref();
    }
    setDefaults();

    // 5. Hide the login form and show the Make call UI
    toggleDisplay("signin", "hide");
    toggleDisplay("makecall", "show");
    toggleDisplay("logoutButton", "show");
  })
  .catch((err) => {

    // In case of failure, show the error message
    updateAlertMessage("w3-pale-red", "<p> " + err + "</p>", 3000);

    });

  // Clear the password field
  document.getElementById("password").value = "";

  return false;
}

// Check if the user has already signed in
function checkSignIn() {

    console.log('check sign in');

  // If the access token is already set, don't show the login screen to the user.
  if (window.localStorage.getItem("access_token")) {

    // Check if the access token is valid.
    // If not, get new one using refresh token.
    // If refresh token also fails, logout

    // Prepare to read the user's preferences
    const decodedToken = decodeJwt(window.localStorage.getItem("access_token"));
    userId = decodedToken.user_id;
    accountId = decodedToken.acc_id;
    userPrefCache = 'user_' + accountId + '_' + userId;

    // TODO: Refresh the access token. If it fails, show the login screen to user.

    window.localStorage.setItem('loggedIn',true);

    // don't show the login form
    toggleDisplay("signin", "hide");
    toggleDisplay("makecall", "show");

    // Load the user's preferences
    loadUserPref();
    setDefaults();

  } else {

    console.log("not logged in");
    // show the login form
    toggleDisplay("signin", "show");
    toggleDisplay("makecall", "hide");
    toggleDisplay("logoutButton", "hide");
  }
}

function logout() {
  
  console.log("logout()");

  // Hide the make call UI and show the login form
  toggleDisplay("signin", "show");
  toggleDisplay("makecall", "hide");
  toggleDisplay("logoutButton", "hide");
  
  // Reset the UI and the tokens
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem('userId');
  window.localStorage.removeItem('userEmail');
  window.localStorage.removeItem('accountId');
  window.localStorage.setItem('loggedIn',false);
  toggleDisplay("settings", "hide");
  document.getElementById("arrowhead").classList.remove("icon-up");
  document.getElementById("arrowhead").classList.add("icon-down");

}

