function call() {

  /* Check if the token is still valid. 
    If it is, then proceed. Otherwise try to 
    regenerate the token.
    */

  const checkToken = checkTokenExpiry();
  checkToken.then(() => {
    const call1 = document.getElementById(CALL1_ID).value;

    if (callOneValue != call1) {
      callOneValue = call1;
      storeUserPref();
    }
    const call2 = document.getElementById(CALL2_ID).value;

    const requestHeader = new Headers();
    requestHeader.append(
      "Authorization",
      "Bearer " + localStorage.getItem("access_token")
    );
    requestHeader.append("Connection", "keep-alive");
    requestHeader.append("Content-Type", "application/json;charset=UTF-8");

    const requestBody = JSON.stringify({
      app_id: userId + "_" + accountId,
      call1: call1,
      call2: call2,
      show_1: "automatic",
      show_2: userCli,
    });

    const options = {
      method: "POST",
      headers: requestHeader,
      body: requestBody,
    };

    const uri = API_BASE + CALLBACK_URI;

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          if (response.status == "403") {
            updateAlertMessage(
              "w3-pale-red",
              "<p><strong>Call Failed</strong>. You do not have enough balance to connect the call.</p>",
              3000
            );
          }

          console.log(response.status);
          return 0;
        }
      })
      .then((json) => {
        if (json != 0) {
          const call_id = json["response"]["session_id"];
          console.log("Call success. Call ID " + call_id);
          updateAlertMessage("w3-pale-green", CALL_SUCCESS_MSG, 3000);
        }
      })
      .catch((err) => console.log("Request Failed", err));
  });

  return false;
}
