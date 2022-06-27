/*
 *
 * Get an access token from the Sonetel API
 *
 * Documentation: https://docs.sonetel.com/docs/sonetel-documentation/b3A6MTUxMzg1OTc-create-token
 *
 */
async function getSonetelToken() {
  // Show a spinner while getting a token
  simpleToggle("spinnerModal");

  console.log("get token");

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Basic " + btoa("sonetel-web" + ":" + "sonetel-web")
  );
  myHeaders.append("Connection", "keep-alive");

  const response = await fetch(AUTH_API, {
    method: "post",
    headers: myHeaders,
    body: new FormData(document.getElementById("loginForm")),
  });
  //Hide the spinner once we get the response
  simpleToggle("spinnerModal");

  if (response.ok) {
    const responseJson = await response.json();
    return responseJson;
  } else {
    var message;
    switch (response.status) {
      case 400:
        message = "Incorrect password";
        break;
      case 401:
        message = "Incorrect username";
        break;
    }
    //const message = `${response.status}`;
    throw new Error(message);
  }
}

// Check if the access token is valid
async function checkAccessToken(access_token) {
  //
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + access_token);
  myHeaders.append("Connection", "keep-alive");
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const uri = API_BASE + "/account";
  const response = await fetch(uri, requestOptions);

  if (response.ok) {
    // The token is OK.
    return true;
  } else {
    if (response.status == 401) {
      // If the access token has expired, try and refresh
      return refreshAccessToken(window.localStorage.get("refresh_token"));
    } else if (response.status >= 500 && response.status <= 599) {
      updateAlertMessage(
        "w3-pale-red",
        "<p>Something went wrong. Cannot connect to Sonetel's servers.</p>",
        5000
      );
    }
  }
}

// Refresh the access token using the refresh_token
async function refreshAccessToken(refresh_token) {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Basic " + btoa("sonetel-web" + ":" + "sonetel-web")
  );
  myHeaders.append("Connection", "keep-alive");

  var requestBody = new URLSearchParams();
  requestBody.append("grant_type", "refresh_token");
  requestBody.append("refresh", "yes");
  requestBody.append("refresh_token", refresh_token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: requestBody,
  };

  const response = await fetch(AUTH_API, requestOptions);

  if (response.ok) {
    const responseJson = await response.json();
    window.localStorage.setItem("access_token", responseJson["access_token"]);
    window.localStorage.setItem("refresh_token", responseJson["refresh_token"]);
    return true;
  } else {
    responseStatus = response.status;
    if (responseStatus == 401) {
      logout();
    } else {
      updateAlertMessage(
        "w3-pale-red",
        "<p>Something went wrong. Please try again later.</p>",
        5000
      );
      return false;
    }
  }
}

// Decode the token
function decodeJwt(token) {
  return JSON.parse(atob(token.split(".")[1]));
}
