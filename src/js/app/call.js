function call() {

    console.log('make call()');
    const call1 = document.getElementById('call1').value;
    if(callOneValue != call1){
        callOneValue = call1;
        storeUserPref();
    }
    const call2 = document.getElementById('call2').value;
    //alert('Initiating callback call between "' + callOneValue + '" and "' + call2 + '" using caller ID ' + userCli);
    
    const requestHeader = new Headers();
    requestHeader.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    requestHeader.append("Connection", "keep-alive");
    requestHeader.append("Content-Type", "application/json;charset=UTF-8");

    const requestBody = JSON.stringify({
        app_id: userId + '_' +accountId,
        call1: call1,
        call2: call2,
        show_1: "automatic",
        show_2: userCli
    });

    const options = {
        method: "POST",
        headers: requestHeader,
        body: requestBody,
    };

    const uri = API_BASE + '/make-calls/call/call-back';

    fetch(uri,options)
    .then((response) => {

        if(response.ok){
            return response.json();
        }else{
            if(response.status == '403'){
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
        if(json != 0){
            const code = json["status_code"];
            console.log(code);
            console.log(json['response']['session_id']);
            updateAlertMessage(
                "w3-pale-green",
                "<p><strong>Success</strong>. Your call will be connected soon.</p>",
                3000
                );
        }
    })
    .catch((err) => console.log("Request Failed", err));

    return false;
    
}
