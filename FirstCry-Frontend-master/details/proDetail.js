import env from '../../env.obj.js';
import fetchData from '../products/utils/fetch.js'
import {navbar,footer} from "../products/components/nav.js";


document.querySelector("nav").innerHTML = navbar();
document.querySelector("footer").innerHTML = footer();

async function updateTot(){
    let user = JSON.parse(localStorage.getItem('user')) || 0;
    let totalCartItems = await fetch(`${env.API_URL}/products/count/${user._id}`);
    totalCartItems = await totalCartItems.json();
    document.getElementById('productNo').textContent = totalCartItems.size;
}
updateTot()

let data = [];
let elem = [];
window.onload = async ()=> {
    let product_id = localStorage.getItem('product_id');
    let token = localStorage.getItem('token');
    let res = await fetch(`${env.API_URL}/products/getone/${product_id}`, {
        headers: {
            'authorization' : token
        }
    });
    res = await res.json();
    if(res.success){
        elem = res.data;
    }
    
    let productName = document.querySelector("#productName");
    productName.innerText = elem.title;

    firstDisplay();
    sideImages();
    productDescription();
    let response = await fetchData();
    if(response.success){
        data = response.data;
    }else {
        alert(response.message);
    }
    display(data);
    findLocation()
}


let sizeValue = JSON.parse(localStorage.getItem("sizeValue")) || "9 to 12 M" ;
let weightValue = JSON.parse(localStorage.getItem("sizeValue")) || "8.9 - 9.6 Kgs";
let userPincode = JSON.parse(localStorage.getItem("pin")) || [];
let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
let shortProducts = JSON.parse(localStorage.getItem("shortlist")) || [];

let userName = document.querySelector("#userName");

let name = JSON.parse(localStorage.getItem("user"));
name = name && name.name;
userName.innerHTML = name || "<span>Login /</span><span> Register</span>";

userName.onclick = ()=> {
    if(name){
        let res = confirm('Logout');
        if(res){
            clearLocalStorage();
            window.location.href = '../index.html'
        }
    }else {
        window.location.href = '../login/login.html'
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

if (userPincode.length!=0){
    document.querySelector("#pincodeCheckerAfter").style.display = "flex";
    document.querySelector("#pincodeCheckerBefore").style.display =  "none";
    document.querySelector("#pincodeEnter").innerText =   userPincode;
}


function firstDisplay(){
    document.querySelector("#bigImage").innerHTML="";
    let image = document.createElement("img");
    image.style= "width: 100%"
    image.id = "theBigImage";
    image.src= elem.img1;  

    let button1 = document.createElement("button");
    let button2 = document.createElement("button");

    button1.addEventListener("click", ()=>{
        if (document.querySelector("#addToCart").innerText!= "GO TO CART"){
            var flag= false
            cartProducts.map((element)=>{
                if (element.title == elem.title && element.size == sizeValue){
                    document.querySelector("#addToCart").innerHTML= "GO TO CART";
                    flag= true;
                }
            })
                if (!flag){
                    document.querySelector("#addToCart").innerHTML= "GO TO CART";

                    let product_id = localStorage.getItem("product_id");
                    let user = JSON.parse(localStorage.getItem('user'));
                    let token = localStorage.getItem('token');
                    

                    fetch(`${env.API_URL}/products/cart/${product_id}`, {
                        headers: {
                            'authorization': token
                        },
                      }).then((res)=> res.json()).then((res)=> {
                            updateTot();
                            alert(res.message);
                      }).catch((err)=> {
                            console.log(err);
                      })
                }
        }
        else{
            location.href = "../cart/cart.html";
        }
            
    })
    button2.addEventListener("click", ()=>{
        if (document.querySelector("#shortList").innerText!= "SHORTLISTED"){
            var flag= false
            shortProducts.map((element)=>{
                if (element.title === elem.title && element.size == sizeValue){
                    flag= true;
                }
            })
                if (!flag){
                    elem.size=sizeValue;
                    elem.weight =weightValue;
                    shortProducts.push(elem);
                    document.querySelector("#shortList").innerHTML= "SHORTLISTED";
                    document.querySelector("#shortList").style.color = "#ff7043"
                    document.querySelector("#shortList").style.border = "1px solid #ff7043"
                    
                }
        }
        else{
            location.href = "location.html";
    }
            
    })

    button1.innerText= "ADD TO CART";
    button2.innerText= `SHORTLIST`;
    button1.id= "addToCart";
    button2.id= `shortList`;

    document.querySelector("#bigImage").append(image,button1,button2);

}

// sideImages();
function sideImages(){
    document.querySelector("#sideImages").innerHTML="";
        let img1 = document.createElement("img");
        let img2 = document.createElement("img");
        let img3 = document.createElement("img");

        img1.src= elem.img1;
        img2.src= elem.img2;
        img3.src= elem.img3;
        let theImage = document.querySelector("#theBigImage");
        let fullPageImage = document.querySelector("#fullPage");
        let fullImage = document.querySelector("#fullPageImage");

        img1.addEventListener("mouseover", ()=>{
            theImage.src = img1.src;
        });
        img1.addEventListener("click", ()=>{
            fullPageImage.style.display ="flex";
            fullImage.src= img1.src;
        });
        img2.addEventListener("mouseover", ()=>{
            theImage.src = img2.src;
        });
        img2.addEventListener("click", ()=>{
            fullPageImage.style.display ="flex";
            fullImage.src= img2.src;
        });
        img3.addEventListener("mouseover", ()=>{
            theImage.src = img3.src;
        });
        img3.addEventListener("click", ()=>{
            fullPageImage.style.display ="flex";
            fullImage.src= img3.src;
        });

        document.querySelector("#sideImages").append(img1,img2,img3);
}

// for displaying none of Full page image
document.addEventListener('mouseup', function(e) {
    var container = document.getElementById('fullPage');
    if (container.contains(e.target)) {
        container.style.display = 'none';
    }
});

// productDescription();
async function fetchLocation(){
        
    let address = JSON.parse(localStorage.getItem("pin"));
    try{
        let response = await fetch(`https://api.postalpincode.in/pincode/${address}`);
        let data = await response.json();
        findLocation(data[0].PostOffice[0]);
        console.log(data[0].PostOffice[0]);
        }
        catch(error){
            console.log("Something went wrong");
        }
}
function findLocation(elem){

    let location = document.getElementById('location');
    if (!elem){
        location.innerHTML = localStorage.getItem("location") ||`<i class="fa fa-location-dot"></i><span>  Select location</span>`;
    }
    else{
        location.innerHTML = elem.District;
        localStorage.setItem("location", elem.District);
    }
}

document.querySelector("#pincode").addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        userPincode = document.querySelector("#pincode").value;
        if (userPincode < 100000){
            alert("Invalid Pincode");
        }else{
            document.querySelector("#pincodeCheckerAfter").style.display = "flex";
            document.querySelector("#pincodeCheckerBefore").style.display =  "none";
            document.querySelector("#pincodeEnter").innerText =   document.querySelector("#pincode").value;
            localStorage.setItem("pin", userPincode);
            fetchLocation();
        }
        
    }
})
document.getElementById("first").addEventListener("click", function(){
    sizeValue ="3 to 6 M";
        weightValue = "6.4 - 7.9 Kgs"
    sizeData();
        document.querySelector("#first").style.border= "1px solid black";
        document.querySelector("#first").style.color = "black"
        
})
document.querySelector("#second").addEventListener("click", function(){
    
    sizeValue ="6 to 9 M"
    weightValue = "7.9 - 8.9 Kgs"
    sizeData();
    
        document.querySelector("#second").style.border= "1px solid black";
        document.querySelector("#second").style.color = "black"
})
document.querySelector("#third").addEventListener("click", function(){
    
    sizeValue ="9 to 12 M"
    weightValue = "8.9 - 9.6 Kgs"
    sizeData();
    
        document.querySelector("#third").style.border= "1px solid black";
        document.querySelector("#third").style.color = "black"
})
document.querySelector("#forth").addEventListener("click", function(){
    
    sizeValue ="12 to 18 M"
    weightValue = "9.6 - 10.9 Kgs"
    sizeData();
        document.querySelector("#forth").style.border= "1px solid black";
        document.querySelector("#forth").style.color = "black"
})
document.querySelector("#fifth").addEventListener("click", function(){
    
    sizeValue ="18 to 24 m"
    weightValue = "10.9 - 12.5Kgs"
    sizeData();
        document.querySelector("#fifth").style.border= "1px solid black";
        document.querySelector("#fifth").style.color = "black"
})
document.querySelector("#sixth").addEventListener("click", function(){
    
    sizeValue ="2 to 3 Y"
    weightValue = "12.5 - 14 Kgs"
    sizeData();
        document.querySelector("#sixth").style.border= "1px solid black";
        document.querySelector("#sixth").style.color = "black"
})
document.querySelector("#seventh").addEventListener("click", function(){
    
    sizeValue ="3 to 4 Y"
    weightValue = "14 - 16.3 Kgs"
    sizeData();
        document.querySelector("#seventh").style.border= "1px solid black";
        document.querySelector("#seventh").style.color = "black"
})
document.querySelector("#eighth").addEventListener("click", function(){
    sizeData();
        sizeValue ="4 - 5 Y"
        weightValue = "16.3 - 18.4 Kgs"
        document.querySelector("#eighth").style.border= "1px solid black";
        document.querySelector("#eighth").style.color = "black"
})
document.querySelector("#ninth").addEventListener("click", function(){
    
    sizeValue ="5 - 6 Y"
    weightValue = "18.4 - 20.6 Kgs"
    sizeData();
        document.querySelector("#ninth").style.border= "1px solid black";
        document.querySelector("#ninth").style.color = "black"
})

function sizeData(){
        document.getElementById("first").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("first").style.color = "rgb(202, 200, 200)"
        document.getElementById("second").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("second").style.color = "rgb(202, 200, 200)"
        document.getElementById("third").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("third").style.color = "rgb(202, 200, 200)"
        document.getElementById("forth").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("forth").style.color = "rgb(202, 200, 200)"
        document.getElementById("fifth").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("fifth").style.color = "rgb(202, 200, 200)"
        document.getElementById("sixth").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("sixth").style.color = "rgb(202, 200, 200)"
        document.getElementById("seventh").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("seventh").style.color = "rgb(202, 200, 200)"
        document.getElementById("eighth").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("eighth").style.color = "rgb(202, 200, 200)"
        document.getElementById("ninth").style.border= "1px solid rgb(202, 200, 200)";
        // document.getElementById("ninth").style.color = "rgb(202, 200, 200)"
        
        // localStorage.setItem("sizeText",JSON.stringify(sizeValue));
        document.querySelector("#ageData").innerText = sizeValue;
        document.querySelector(".weightValue").innerText = weightValue;
        document.querySelector("#weightValue").innerText = weightValue;

// productDescription();

        var flag= false
            cartProducts.map((element)=>{
                if (element.title == elem.title && element.size == sizeValue){
                    flag= true;
                    document.querySelector("#addToCart").innerHTML= "GO TO CART";
                }
            })
            if (!flag){
                document.querySelector("#addToCart").innerHTML= "ADD TO CART";
            }
        var flag1= false;
            shortProducts.map((element)=>{
                if (element.title === elem.title && element.size == sizeValue){
                    flag1= true;
                    console.log(flag1);
                    document.querySelector("#shortList").innerHTML= "SHORTLISTED";
                    document.querySelector("#shortList").style.color = "#ff7043"
                    document.querySelector("#shortList").style.border = "1px solid #ff7043"
                }
            })
            if (!flag1){
                document.querySelector("#shortList").innerHTML= "SHORTLIST";
                document.querySelector("#shortList").style.color = "grey"
                document.querySelector("#shortList").style.border = "1px solid rgb(208, 200, 200)"
            }
           
    
}


function productDescription(){
    document.querySelector("#one").innerHTML ="";
    let proName = document.createElement("h3");
    let proDes = document.createElement("p");
    let proId = document.createElement("p");
    proName.innerText = elem.title;
    proDes.innerText =`${sizeValue}, ${elem.desc}`;
    proId.innerText = `Product ID: 125488`;

    document.querySelector("#one").append(proName,proDes,proId);

    let disAmount = Math.ceil((elem.strikePrice-elem.price)*100/elem.strikePrice);

    document.querySelector("#priceHead").innerText =elem.price;
    document.querySelector("#MRP").innerText = elem.strikePrice;
    document.querySelector("#discountText").innerText = `(${disAmount}% OFF)`;
    document.querySelector("#clubPrice").innerText = elem.price - 20.20;
    document.querySelector("#colorBoxIn").style.backgroundColor = elem.color;
    if (elem.color=="white"){
        document.querySelector("#colorBoxIn").style.outline= `1px solid black`;   
    }else{
        document.querySelector("#colorBoxIn").style.outline= `1px solid ${elem.color}`;
    }
    document.querySelector("#deliveryDate").innerText = elem.delivery;
    
}


document.querySelector("#rightArrow").addEventListener("click", ()=>{
    let container = document.getElementById("ymalItems");
    let size = window.screen.width;
    if (size<700){
        
        sideScroll(container,"right",2,size*0.5,10);   
    }else{
        sideScroll(container,"right",2,size*0.8,10);
    }
})
document.querySelector("#leftArrow").addEventListener("click", ()=>{
    let container = document.getElementById("ymalItems");
    let size = window.screen.width;
    if (size<700){
        sideScroll(container,"left",2,size*0.5,10);   
    }
    else{
        sideScroll(container,"left",2,size*0.8,10);
    }
})

function sideScroll(element,direction,speed,distance,step){
    let scrollAmount = 0;
    let slideTimer = setInterval(function(){
        if (direction == "left"){
            element.scrollLeft -= step;
        }else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance){
            window.clearInterval(slideTimer);
        }
    },speed);
}

// display(data);
function display(data){
    let productDiv = document.getElementById("ymalItems");
    productDiv.innerHTML = null;

    data.map(({_id, id, img1, img2, img3, title, desc, price, strikePrice, off, delivery, url1, url2, url3, color})=> {
        if (title!= elem.title){
            let div = document.createElement("div");
        div.setAttribute("class", "products");
        let imgDiv = document.createElement("div");
          let imgP = document.createElement("img");
          imgP.src = img1;
        imgDiv.append(imgP);

        let titleP = document.createElement("p");
          titleP.innerText = title;
        
        let strikeDiv = document.createElement("div");
        strikeDiv.setAttribute("id", "ymlPrices");
        
          let priceP = document.createElement("p");
            priceP.innerText = `₹ ${price}`;
          let strikeP = document.createElement("span");
            strikeP.innerText = `₹ ${strikePrice}`;
            strikeP.style = "text-decoration:line-through"
          let offP = document.createElement("span");
            offP.innerText = `(${off}% Off)`;
            offP.id = "offPrice"
        strikeDiv.append(priceP, strikeP, offP);

        let priceDiv = document.createElement("div");
        priceDiv.setAttribute("class", "priceDiv");

        let cartDiv = document.createElement("div");
          cartDiv.setAttribute("class", "cartDiv");
        let img_id;
        div.addEventListener("mouseenter", ()=> {
            let arr = [img1, img2, img3];
            let k = 1;
            img_id = setInterval(() => {
                imgP.src = arr[k%3];
                k++;
            }, 1000);
        });

        div.addEventListener("mouseleave", ()=> {
            clearInterval(img_id);
            imgP.src = img1;
        })
        
        div.append(imgDiv, titleP, strikeDiv, priceDiv, cartDiv);
        productDiv.append(div);
        
        div.onclick = ()=> {
            localStorage.setItem("product_id", _id);
            window.location.href = "./proDetail.html";
        }
        }
        
    })
}

let cartBtn = document.getElementById('cartBtn');
cartBtn.onclick = ()=> {
    window.location.href = '../cart/cart.html';
}



// findLocation();