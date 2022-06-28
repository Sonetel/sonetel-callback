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

// Refresh the access token using the refresh_token
async function refreshAccessToken() {

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Basic " + btoa("sonetel-web" + ":" + "sonetel-web")
  );
  myHeaders.append("Connection", "keep-alive");

  var requestBody = new URLSearchParams();
  requestBody.append("grant_type", "refresh_token");
  requestBody.append("refresh", "yes");
  requestBody.append("refresh_token", localStorage.getItem("refresh_token"));

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
      genericErrorMessage(5000);
      return false;
    }
  }
}

// Decode the token
function decodeJwt(token) {
  return JSON.parse(atob(token.split(".")[1]));
}

// Check if the token has expired or will expired within 1 hour
// Returns true if token has expired otherwise false.
async function checkTokenExpiry(){
  const token = localStorage.getItem('access_token');
    
  const decodedToken = decodeJwt(token);
  const currentTimeStamp = Math.floor(Date.now() / 1000); 

  if(decodedToken.exp - currentTimeStamp <= 3600){
    
    // expired or about to expire.
    const refreshSuccess = await refreshAccessToken();
    if(!refreshSuccess){
      genericErrorMessage(2500);
      setTimeout(logout(),2000)
    }
  }

  return false;
}