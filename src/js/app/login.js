
function login() {
    console.log("login.js");
    return false;
}


function decodeJwt(token) {
    return JSON.parse(atob(token.split('.')[1]))
}