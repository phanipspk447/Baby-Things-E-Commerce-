import {navbar,footer} from "../products/components/nav.js"

document.querySelector("nav").innerHTML = navbar();
document.querySelector("footer").innerHTML = footer();

let userData = JSON.parse(localStorage.getItem("user"));
let TotalPrice = JSON.parse(localStorage.getItem("total"));
let address = JSON.parse(localStorage.getItem("pin"));

async function fetchLocation(){
    console.log(address);
    try{
        let response = await fetch(`https://api.postalpincode.in/pincode/${address}`);
        let data = await response.json();
        displayAddress(data[0].PostOffice[0]);
        console.log(data);
        }
        catch(error){
            console.log("Something went wrong");
        }
}

function displayAddress(elem){
    document.querySelector("#city").innerText = elem.District;
    document.querySelector("#state").innerText = elem.Circle;
    document.querySelector("#pinCodeHere").innerText = elem.Pincode;
}

let userName = document.getElementById('userName');
let name = JSON.parse(localStorage.getItem("user"));
name = name && name.name;
userName.innerHTML = name || "<span>Login /</span><span> Register</span>";

userName.onclick = ()=> {
    let res = confirm('Logout');
    if(res){
        clearLocalStorage();
        window.location.href = '../index.html'
    }
} 

function clearLocalStorage(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('pin');
    localStorage.removeItem('product_id');
    localStorage.removeItem('total');
    localStorage.removeItem('cart');
    localStorage.removeItem('location');
}


function findLocation(){
    let location = document.getElementById('location');
    location.innerHTML = localStorage.getItem('location') || '<i class="fa fa-location-dot"></i><span>  Select location</span>'
}
findLocation()  


document.querySelector("#UserMobileNumber").innerText = userData.mobile;
document.querySelector("#UserNamegiven").innerText = userData.name;
document.querySelector("#price").innerText = TotalPrice;