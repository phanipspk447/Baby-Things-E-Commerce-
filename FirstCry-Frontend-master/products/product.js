import env from '../../env.obj.js';
import fetchData from "./utils/fetch.js";
import {navbar, footer} from "./components/nav.js";

document.querySelector('nav').innerHTML = navbar();
document.querySelector('footer').innerHTML = footer();
updateTot();

let userName = document.getElementById('userName');

let name = JSON.parse(localStorage.getItem("user"));
name = name && name.name;
userName.innerHTML = name || "<span>Login /</span><span> Register</span>";

userName.onclick = ()=> {
    if(userName.innerHTML === "<span>Login /</span><span> Register</span>" ){
        window.location.href = '../login/login.html'
    } else {
        let res = confirm('Logout');
        if(res){
            clearLocalStorage();
            window.location.href = '../index.html'
        }
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


async function tshirt(){
    let res = await fetchData();
    let data;
    if(res.success) {
        data = res.data;
    }else {
        alert(res.message);
        window.location.href = '../login/login.html'
        console.log(res)
    }
    display(data);
}

tshirt()

function display(data = []){
    let productDiv = document.getElementById("productDiv");
    productDiv.innerHTML = null;
    // console.log(data)

    data.map(({_id, id, img1, img2, img3, title, desc, price, strikePrice, off, delivery, url1, url2, url3, color})=> {
        let div = document.createElement("div");
        div.setAttribute("class", "products");

        let imgDiv = document.createElement("div");
          let imgP = document.createElement("img");
          imgP.src = img1;
        imgDiv.append(imgP);

        let titleP = document.createElement("p");
          titleP.innerText = title;
        
        let strikeDiv = document.createElement("div");
        strikeDiv.setAttribute("class", "strikePriceDiv");
        
          let priceP = document.createElement("p");
            priceP.innerText = `₹ ${price}`;
          let strikeP = document.createElement("span");
            strikeP.innerText = `₹ ${strikePrice}`;
          let offP = document.createElement("span");
            offP.innerText = `(${off}% Off)`;
        strikeDiv.append(priceP, strikeP, offP);

        let priceDiv = document.createElement("div");
        priceDiv.setAttribute("class", "priceDiv");

          let starDiv = document.createElement("div");
            let starImg = document.createElement("img");
            starImg.src = "./img/star.png";
          starDiv.append(starImg);

          let clubP = document.createElement("p");
            clubP.innerHTML = `Club Price: <span>₹ ${price - 20}</span>`;
          let symbol = document.createElement("span");
            symbol.setAttribute("class", "material-symbols-outlined");
            symbol.innerText = "chevron_right";

        priceDiv.append(starDiv, clubP, symbol);

        let p = document.createElement("p");
          p.innerText = delivery;

        let cartDiv = document.createElement("div");
          cartDiv.setAttribute("class", "cartDiv");
        
          let btnDiv = document.createElement("div");
            
            let btn1 = document.createElement("button");
              btn1.innerText = "ADD TO CART";
              btn1.onclick = ()=>{

                if(btn1.innerText == "GO TO CART"){
                    window.location.href = "../cart/cart.html";
                }
                let token = localStorage.getItem('token');

                  fetch(`${env.API_URL}/products/cart/${_id}`, {
                    headers: {
                        'authorization': token
                    },
                  }).then((res)=> res.json()).then((res)=> {
                        updateTot();
                        alert(res.message);
                  }).catch((err)=> {
                        console.log(err);
                  })

                  
                  btn1.innerText = "GO TO CART";
              };
            let btn2 = document.createElement("button");
              btn2.innerText = "SHORTLIST";
              btn2.onclick = ()=>{
                // SHORTLIST 
              };
          btnDiv.append(btn1, btn2);
        cartDiv.append(btnDiv);
        let product_id;
        div.addEventListener("mouseenter", ()=> {
            let arr = [img1, img2, img3];
            let k = 1;
            product_id = setInterval(() => {
                imgP.src = arr[k%3];
                k++;
            }, 1000);
        });

        div.addEventListener("mouseleave", ()=> {
            clearInterval(product_id);
            imgP.src = img1;
        })

        div.append(imgDiv, titleP, strikeDiv, priceDiv, p, cartDiv);
        productDiv.append(div);
        
        imgDiv.onclick = ()=> {
            localStorage.setItem("product_id", _id);
            window.location.href = "../details/proDetail.html";
        }
    });
}


let priceFilter = null;
let discountFilter = null;   
let colorFilter = null;
let sort = null;

let sortBar = document.getElementById("sort");
sortBar.onchange = ()=> {
    sort = sortBar.value;
    filterProducts();
};

// SORT BY PRICE 
let pr1 = document.getElementById("pr1");
let pr2 = document.getElementById("pr2");
let pr3 = document.getElementById("pr3");
let pr4 = document.getElementById("pr4");
let pr5 = document.getElementById("pr5");

let priceArray = [pr1, pr2, pr3, pr4, pr5];

pr1.addEventListener("change", ()=> {
    priceFilter = '0-250'

    disableRest(priceArray, 1, 'price');
    filterProducts()
});
pr2.addEventListener("change", ()=> {
    priceFilter = '250-500'

    disableRest(priceArray, 2, 'price');
    filterProducts()
});
pr3.addEventListener("change", ()=> {
    priceFilter = '500-1000'

    disableRest(priceArray, 3, 'price');
    filterProducts()
});
pr4.addEventListener("change", ()=> {
    priceFilter = '1000-2000'

    disableRest(priceArray, 4, 'price');
    filterProducts()
});
pr5.addEventListener("change", ()=> {
    priceFilter = '2000-3000'

    disableRest(priceArray, 5, 'price');
    filterProducts()
});


// SORT BY DISCOUNT 
let d1 = document.getElementById("d1");
let d2 = document.getElementById("d2");
let d3 = document.getElementById("d3");
let d4 = document.getElementById("d4");
let d5 = document.getElementById("d5");

let discountArray = [d1, d2, d3, d4, d5];

d1.addEventListener("change", ()=> {
    discountFilter = '0-10';

    disableRest(discountArray, 1, 'disc');
    filterProducts()
});
d2.addEventListener("change", ()=> {
    discountFilter = '10-20';

    disableRest(discountArray, 2, 'disc');
    filterProducts()
});
d3.addEventListener("change", ()=> {
    discountFilter = '20-30';

    disableRest(discountArray, 3, 'disc');
    filterProducts()
});
d4.addEventListener("change", ()=> {
    discountFilter = '30-40';

    disableRest(discountArray, 4, 'disc');
    filterProducts()
});
d5.addEventListener("change", ()=> {
    discountFilter = '40-100';

    disableRest(discountArray, 5, 'disc');
    filterProducts()
});

// SORT BY COLORS
let c1 = document.getElementById("c1");
let c2 = document.getElementById("c2");
let c3 = document.getElementById("c3");
let c4 = document.getElementById("c4");
let c5 = document.getElementById("c5");

let colorArray = [c1, c2, c3, c4, c5];

c1.addEventListener("change", ()=> {
    colorFilter = 'blue'

    disableRest(colorArray, 1, 'color');
    filterProducts()
});
c2.addEventListener("change", ()=> {
    colorFilter = 'white'

    disableRest(colorArray, 2, 'color');
    filterProducts()
});
c3.addEventListener("change", ()=> {
    colorFilter = 'red'

    disableRest(colorArray,  3, 'color');
    filterProducts()
});
c4.addEventListener("change", ()=> {
    colorFilter = 'yellow'

    disableRest(colorArray, 4, 'color');
    filterProducts()
});
c5.addEventListener("change", ()=> {
    colorFilter = 'green'

    disableRest(colorArray, 5, 'color');
    filterProducts()
});

// <---------------------------------------------------->
async function filterProducts(){
    let response = await fetch(`${env.API_URL}/products/filter?price=${priceFilter}&disc=${discountFilter}&color=${colorFilter}&sort=${sort}`);
    let result = await response.json();
    display(result.data);
}
// <---------------------------------------------------->


function disableRest(arr, val, filter){
    let flag = true;
    for(let k of arr){
        if(k.value != val){
            k.checked = false;
        } 
        if(k.checked) flag = false;
    }
    if(flag){
        if(filter === 'price') priceFilter = null;
        if(filter === 'disc') discountFilter = null;
        if(filter === 'color') colorFilter = null;
    }
}

function clearAll(){
    disableRest(priceArray, -1, 'price');
    disableRest(discountArray, -1, 'disc');
    disableRest(colorArray, -1, 'color');
    sortBar.value= 'null';
    sort = 'null';
    filterProducts();
}

let clearBtn = document.getElementById('clearAll');
clearBtn.style = "cursor: pointer"
clearBtn.onclick = ()=> {
    clearAll();
}



async function updateTot(){
    let user = JSON.parse(localStorage.getItem('user')) || 0;
    let totalCartItems = await fetch(`${env.API_URL}/products/count/${user._id}`);
    totalCartItems = await totalCartItems.json();
    document.getElementById('productNo').textContent = totalCartItems.size;
    
}

let searchBox = document.getElementById('search_box');
let searchBtn = document.getElementById('searchBtn');

searchBox.oninput = debouncer(()=> searchProducts(searchBox.value), 1000);

async function searchProducts(text){
    if(text === '') text = 'all';
    let res = await fetch(`${env.API_URL}/products/search/${text}`);
    res = await res.json();
    if(res.success){
        display(res.data);
    }
}

function debouncer(cb, delay){
    let debouncing;
    return ()=> {
        debouncing && clearTimeout(debouncing);
        debouncing = setTimeout(()=> {
            cb();
        }, delay);
    }
}



let cartBtn = document.getElementById('cartBtn');
cartBtn.onclick = ()=> {
    window.location.href = '../cart/cart.html';
}

let pinCode = document.getElementById('pinCode');
let pin = localStorage.getItem('pin') || " ";
pinCode.innerText = pin;

function findLocation(){
    let location = document.getElementById('location');
    location.innerHTML = localStorage.getItem('location') || '<i class="fa fa-location-dot"></i><span>  Select location</span>'
}
findLocation()  