import env from '../env.obj.js';
document.getElementById("form").addEventListener("submit", registration)
var userArr = JSON.parse(localStorage.getItem("userInfo")) || [];

function registration(event) {
    event.preventDefault();
    var fullname = document.getElementById("name").value
    var number = document.getElementById("mobile").value
    var email = document.getElementById("email").value
    var password = document.getElementById("pass").value
   
 
    var userInfo = {
        name: fullname,
        mobile: number,
        email: email,
        password: password,
        login_type: 'email'
    }
    if(fullname=='' || number=='' || email==''||password==''){
        alert("something went wrong");
    }else{
        fetch(`${env.API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            if(res.success){
                alert('Registration Successful');
                window.location.href = "login.html"
            }else{
                alert(res.message);
            }
            console.log(res);
        }).catch((err)=> {
            console.log(err);
        })

    }
}
