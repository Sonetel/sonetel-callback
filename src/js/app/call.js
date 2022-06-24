function call() {

    console.log('call()');
    const call1 = document.getElementById('call1').value;
    if(callOneValue != call1){
        callOneValue = call1;
        storeUserPref();
    }
    const call2 = document.getElementById('call2').value;
    alert('making a call to ' + call2 + ' using caller ID ' + userCli);
    // Add code to make a call
    return false;
    
}
