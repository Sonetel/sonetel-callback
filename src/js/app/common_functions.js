function simpleToggle(id){
    const elem = document.getElementById(id);
    if(elem.classList.contains('w3-hide')){
        elem.classList.remove('w3-hide');
    }else{
        elem.classList.add('w3-hide');
    }
}

// Toggle the display of any element given their #ID
function toggleDisplay(id, status) {
  const elem = document.getElementById(id);
  if (status == "hide") {
    elem.classList.add("w3-hide");
  } else if (status == "show") {
    elem.classList.remove("w3-hide");
  } else {
    console.error("unexpected value of 'show' in 'toggleDisplay()'");
  }
}

// Controls the message banner at the top
function updateAlertMessage(colorClass,messageHtml,interval) {
  const elem = document.getElementById(MSG_ID);
  elem.innerHTML = messageHtml;
  elem.classList.add(colorClass);
  simpleToggle(MSG_ID);
  setTimeout(function() {
    simpleToggle(MSG_ID);
    elem.classList.remove(colorClass);
},interval);

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
    document.getElementById("number2").value = number2.replaceAll(/\D/g, "");
    return qParams.get("num");
  }
  return "";
}

// Show a text input field is the user opts to get called via other number/address
function checkSelectValue(value) {
  if (value == "other") {
    toggleDisplay("call1", "show");
  } else {
    toggleDisplay("call1", "hide");
  }
}

// Toggle the advanced settings section
function toggleSettings(){
    simpleToggle('settings');
    const arrowElem = document.getElementById('arrowhead');
    if(arrowElem.classList.contains('icon-down')){
        arrowElem.classList.remove('icon-down');
        arrowElem.classList.add('icon-up');
    }else{
        arrowElem.classList.remove('icon-up');
        arrowElem.classList.add('icon-down');
    }
}