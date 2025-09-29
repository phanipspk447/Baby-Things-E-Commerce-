import env from '../env.obj.js';
let btn  = document.getElementById('home_btn');

btn.onclick = async ()=> {
    try {
        let res = await fetch(`${env.API_URL}/auth/google`);
        res = await res.json();
        
        if(res.success){
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            window.location.href = '../index.html';
        }else{
            window.location.href = './login.html';
        }
    } catch (err) {
        console.log(err);
    }
}