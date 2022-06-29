// Handle login to the app based on the username and password entered by the user
function login() {
  // get the token from Sonetel
  getSonetelToken()
    .then((data) => {
      // If the token creation is successful:

      // 1. Store the access & refresh tokens.
      const accessToken = data["access_token"];
      const refreshToken = data["refresh_token"];
      window.localStorage.setItem("access_token", accessToken);
      window.localStorage.setItem("refresh_token", refreshToken);
      window.localStorage.setItem("loggedIn", "true");

      // 2. Decode the token and set the userID & account IDs.
      const decodedToken = decodeJwt(accessToken);
      userId = decodedToken.user_id;
      userEmail = decodedToken.user_name;
      accountId = decodedToken.acc_id;

      // 3. Prepare to set the user's preferences
      userPrefCache = "user_" + accountId + "_" + userId;
      callOneValue = userEmail;
      callOneSetting = "email";
      userCli = "automatic";

      // 4. Store the user's default preferences if they aren't already present.
      if (!window.localStorage.getItem(userPrefCache)) {
        storeUserPref();
        setDefaults();
        getCliSettings();
      } else {
        loadUserPref();
      }
      // setDefaults();

      // 5. Hide the login form and show the Make call UI
      toggleDisplay(SIGNIN_FORM_ID, "hide");
      toggleDisplay(MAKECALL_FORM_ID, "show");
      toggleDisplay(LOGOUT_BTN_ID, "show");
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
  // If the access token is already set, don't show the login screen to the user.
  if (
    localStorage.getItem("access_token") &&
    localStorage.getItem("loggedIn") == "true"
  ) {
    
    const checkToken = checkTokenExpiry();
    checkToken.then(() => {
      // Prepare to read the user's preferences
      const decodedToken = decodeJwt(
        window.localStorage.getItem("access_token")
      );
      userId = decodedToken.user_id;
      userEmail = decodedToken.user_name;
      accountId = decodedToken.acc_id;
      userPrefCache = "user_" + accountId + "_" + userId;
      loadUserPref();

      // don't show the login form
      toggleDisplay(SIGNIN_FORM_ID, "hide");
      toggleDisplay(MAKECALL_FORM_ID, "show");

    });
  } else {
    // Hide the make call UI and show the login form
    logout();
  }
}

// Logout the user & reset the app display
function logout() {
  // Hide the make call UI and show the login form
  toggleDisplay(SIGNIN_FORM_ID, "show");
  toggleDisplay(MAKECALL_FORM_ID, "hide");
  toggleDisplay(LOGOUT_BTN_ID, "hide");

  // Reset the UI and the tokens
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.setItem("loggedIn", "false");
  toggleDisplay("settings", "hide");
  document.getElementById("arrowhead").classList.remove("icon-up");
  document.getElementById("arrowhead").classList.add("icon-down");
  document.getElementById('callerId').innerHTML = null;
}
