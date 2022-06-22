// Handle login to the app based on the username and password entered by the user
function login() {
  console.log("login");

  // get the token from Sonetel
  getSonetelToken().then((data) => {

    // If the token creation is successful //

    // 1. Store the access & refresh tokens.
    const accessToken = data["access_token"];
    const refreshToken = data["refresh_token"];
    window.localStorage.setItem("access_token", accessToken);
    window.localStorage.setItem("refresh_token", refreshToken);

    updateAlertMessage("w3-pale-green", "<p>Login success!</p>", 1500);

    // 2. Decode the token and set the userID & account IDs.
    const decodedToken = decodeJwt(accessToken);
    userId = decodedToken.user_id;
    userEmail = decodedToken.user_name;
    accountId = decodedToken.acc_id;
    userPrefCache = 'user_' + accountId + '_' + userId;

    // Store the user's default preferences
    if(!window.localStorage.getItem(userPrefCache)){
        window.localStorage.setItem(userPrefCache,JSON.stringify({
            "userid" : userId,
            "accountid" : accountId,
            "email" : userEmail,
            "call1_setting" : "email",
            "call1_value" : userEmail,
            "cli" : "automatic"
        }));
    }

    window.localStorage.setItem('userId',userId);
    window.localStorage.setItem('userEmail',userEmail);
    window.localStorage.setItem('accountId',accountId);
    

    // Hide the login form and show the Make call UI
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

  // If the access token is already set, don't show the login screen to the user.
  if (window.localStorage.getItem("access_token")) {

    // TODO: Refresh the access token. If it fails, show the login screen to user.

    console.log("logged in");
    // don't show the login form
    toggleDisplay("signin", "hide");
    toggleDisplay("makecall", "show");

  } else {

    console.log("not logged in");
    // show the login form
    toggleDisplay("signin", "show");
    toggleDisplay("makecall", "hide");
    toggleDisplay("logoutButton", "hide");
  }
}

// Decode the token
function decodeJwt(token) {
  return JSON.parse(atob(token.split(".")[1]));
}

function logout() {
  
  console.log("logout()");

  // Hide the make call UI and show the login form
  toggleDisplay("signin", "show");
  toggleDisplay("makecall", "hide");
  toggleDisplay("logoutButton", "hide");
  
  // Remove the access & refresh tokens from localStorage
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem('userId');
  window.localStorage.removeItem('userEmail');
  window.localStorage.removeItem('accountId');

}

async function getSonetelToken() {
  /*
   *
   * Get an access token from the Sonetel API
   *
   * Documentation: https://docs.sonetel.com/docs/sonetel-documentation/b3A6MTUxMzg1OTc-create-token
   *
   */
  simpleToggle("spinnerModal");

  console.log("get token");

  myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Basic " + btoa("sonetel-web" + ":" + "sonetel-web")
  );

  const response = await fetch(AUTH_API, {
    method: "post",
    headers: myHeaders,
    body: new FormData(document.getElementById("loginForm")),
  });
  simpleToggle("spinnerModal");
  if (response.ok) {
    return response.json();
  } else {
    var message;
    switch (response.status){
        case 400:
            message = 'Incorrect password';
            break;
        case 401:
            message = 'Incorrect username';
            break
    }
    //const message = `${response.status}`;
    throw new Error(message);
  }
}
