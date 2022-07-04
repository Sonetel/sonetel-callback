
function simpleToggle(id) {
  const elem = document.getElementById(id);
  if (elem.classList.contains("w3-hide")) {
    elem.classList.remove("w3-hide");
  } else {
    elem.classList.add("w3-hide");
  }
}

// Toggle the display of any element given their #ID
function toggleDisplay(id, status) {
  const elem = document.getElementById(id);
  if (status == "hide") {
    elem.classList.add("w3-hide");
  } else if (status == "show") {
    elem.classList.remove("w3-hide");
  }
}

// Controls the message banner at the top
function updateAlertMessage(colorClass, messageHtml, interval) {
  const elem = document.getElementById(MSG_ID);
  elem.innerHTML = messageHtml;
  elem.classList.add(colorClass);
  simpleToggle(MSG_ID);
  setTimeout(function () {
    simpleToggle(MSG_ID);
    elem.classList.remove(colorClass);
  }, interval);
}

// Get the URL parameters
function getUrlParam() {

  const queryString = window.location.search;

  if (queryString.length != 0) {
    const qParams = new URLSearchParams(queryString);
    var number2 = qParams.get("num");

    // Remove any extra characters such as brackets, hyphens or spaces
    // from the number to ensure only the actual phone number remains.
    number2 = number2.replaceAll("%20", "");
    number2 = number2.replaceAll("%28", "");
    number2 = number2.replaceAll("%29", "");
    document.getElementById("call2").value = number2.replaceAll(/\D/g, "");
    //return qParams.get("num");
  }
  return "";
}

// Show a text input field is the user opts to get called via other number/address
function checkSelectValue(value) {

  if (value == "other") {
    toggleDisplay(CALL1_ID, "show");
    callOneSetting = 'other';
  } else {
    callOneSetting = 'email';
    //callOneValue = userEmail;
    //document.getElementById(CALL1_ID).value = userEmail;
    toggleDisplay(CALL1_ID, "hide");
  }
  storeUserPref();
}

// Toggle the advanced settings section
function toggleSettings() {
  simpleToggle("settings");
  
  const arrowElem = document.getElementById("arrowhead");
  if (arrowElem.classList.contains("icon-down")) {
    arrowElem.classList.remove("icon-down");
    arrowElem.classList.add("icon-up");
  } else {
    arrowElem.classList.remove("icon-up");
    arrowElem.classList.add("icon-down");
  }
}

function loadUserPref() {

  userPref = JSON.parse(window.localStorage.getItem(userPrefCache));
  callOneValue = userPref.callOneValue;
  callOneSetting = userPref.callOneSetting;
  userCli = userPref.cli;
  window.sessionStorage.setItem("userCli",userCli)

  setDefaults();
  getCliSettings();

}

function setDefaults() {
    
  // load the user's preferences
  if(userCli.length > 0){
    document.getElementById("callerId").value = userCli;
  }
  if(callOneSetting.length > 0){
    document.getElementById(CALL1_SETTINGS_ID).value = callOneSetting;
  }
  if(callOneValue.length > 0){
    document.getElementById(CALL1_ID).value = callOneValue;
  }

  if(callOneSetting == 'other'){
    toggleDisplay(CALL1_ID, "show");
  }else{
    toggleDisplay(CALL1_ID, "hide");
  }

}

// Store the updated cli setting
function updateCliSetting() {
    userCli = document.getElementById('callerId').value;
    window.sessionStorage.setItem("userCli",userCli);
    storeUserPref();
}

// Store or update the user's preferences
function storeUserPref() {
    window.localStorage.setItem(userPrefCache,JSON.stringify({
        "userId" : userId,
        "accountId" : accountId,
        "email" : userEmail,
        "callOneSetting" : callOneSetting,
        "callOneValue" : callOneValue,
        "cli" : userCli.trim()
    }));
}


function genericErrorMessage(time) {
  updateAlertMessage(
    "w3-pale-red",
    "<p>Something went wrong. Please try again later.</p>",
    time
  );
}


function getCliSettings() {
  /* 
  Get the phone numbers that the user is allowed to use as caller ID
  1. Verified mobile numbers added for call forwarding
  2. Phone numbers purchased via Sonetel that can be used as caller ID.
  */
  
  const token = localStorage.getItem("access_token");
  const cli = sessionStorage.getItem('userCli');
  const decodedToken = decodeJwt(token);
  const userid = decodedToken.user_id;
  const accid = decodedToken.acc_id;
  const cliList = document.getElementById("callerId");
  const reqHeader = new Headers();
  var setDefaultCli = false;
  reqHeader.append("Authorization", `Bearer ${token}`);
  reqHeader.append("Connection", "keep-alive");

  // add the default automatic cli option
  const autoCli = document.createElement("option");
  const autoCliVal = 'automatic';
  autoCli.value = autoCliVal;
  autoCli.text = 'Automatic';

  if(cli == 'automatic'){
    autoCli.selected = true;
  }
  cliList.add(autoCli);
  
  // Fetch options
  const options = {
    method: "GET",
    headers: reqHeader,
  };
  const checkToken = checkTokenExpiry();
  checkToken.then(() => {

    // Fetch the user's verified mobile numbers first
    const uriBase = `${API_BASE}/account/${accid}`;
    var uriEndpoint = `/user/${userid}?fields=phones%2Clocation`;

    fetch(uriBase+uriEndpoint, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          genericErrorMessage(3000);
          return false;
        }
      })
      .then((json) => {
        if (json !== false) {
          const response = json.response;
          const phoneList = response.phones.filter(filterVerifiedMobile);
          const userCountry = response.location.country || "-";
          for (const ph of phoneList) {
            
            
            const opt = document.createElement("option");
            const phoneNumE164 = ph.phnum.trim();
            
            const formattedNumber = formatMobileNumber(phoneNumE164,userCountry);

            formattedNumber.then( (resolvedValue) => {
              opt.value = phoneNumE164;
              opt.text = resolvedValue;

              if(cli == phoneNumE164){
                opt.selected = true;
                setDefaultCli = true;
              }
              cliList.add(opt);
            });

          }
        }
        if(!setDefaultCli){
          sessionStorage.setItem('userCli','automatic');
        }
      })
      .catch((err) => console.log(err));

      // Fetch the subscribed numbers that support outgoing CLI
      uriEndpoint = `/phonenumbersubscription?fields=submission`;
      fetch(uriBase+uriEndpoint, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          updateAlertMessage("w3-pale-red", "<p>Unable to get caller ID settings. Please refresh the page to try again.</p>", 4000);
          return false;
        }
      })
      .then((json) => {
        if (json !== false) {
          const phoneList = json.response.filter(filterSubscribedNumbers);
          for(phone of phoneList) {
            const opt = document.createElement("option");
            const e164Number = phone.phnum.trim();
            opt.value = e164Number;
            opt.text = formatNumber(e164Number,phone.area_code,phone.country_code);
            if(cli == e164Number){
              opt.selected = true;
              setDefaultCli = true;
            }
            cliList.add(opt);
          }
          //
        }
        if(!setDefaultCli){
          sessionStorage.setItem('userCli','automatic');
        }
      })
    
  });
  
}

async function formatMobileNumber(e164Number,userCountry){

  // If user country is not defined, return the unformatted number.
  if(userCountry == '-'){
    return e164Number;
  }
  const uri = `https://api.sonetel.com${GEOLOOKUP_URI}?country=${userCountry}&phone-numbers=${e164Number}`;

  const response = await fetch(uri);
  if(response.ok){
    const json = await response.json();
    return json.response[0].formats["international"];
    
  }else{
    return e164Number;
  }

}

function formatNumber(e164Number,area_code,country_code) {
  let telNumber = e164Number.substring(country_code.length);
  telNumber = telNumber.substring(area_code.length);
  return `+${country_code} ${area_code} ${telNumber}`;
}

function filterVerifiedMobile(phone) {
  return phone.verified.toLowerCase() == 'yes';
}

function filterSubscribedNumbers(phone) {
  return phone.cli_support.toLowerCase() == 'yes';

}