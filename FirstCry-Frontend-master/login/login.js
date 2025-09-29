import env from '../env.obj.js';
document.getElementById("form2").addEventListener("submit", login)
var loginArr = JSON.parse(localStorage.getItem("userInfo")) || [];
async function login(event) {
    event.preventDefault();
    var email = document.getElementById("elogin").value
    var password = document.getElementById("eloginPassword").value
    let obj ={
        email, password
    } 

    let res = await fetch(`${env.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( obj )
    })
    res = await res.json();
    if(res.token){
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        alert("Login Successfull");
        window.location.href = "../index.html"
    }else {
        alert(res.message);
    }

}