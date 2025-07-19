import { getProducts } from "/shared/script.js";


fetch('/shared/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
        const basketheader = document.getElementById("header-basket");
        if (basketheader) {
            basketheader.addEventListener("click", () => {
                window.location.href = `../cart/cart.html`;
            });
        }
        const mainpage_link = document.getElementById("mainpage-link");
        mainpage_link.addEventListener("click", () => {
            window.location.href = `../../index.html`;
        })
       
        const newproductslink = document.getElementById("newarrivals-link");
        const topsellinglink = document.getElementById("topselling-link");
        const signinlink=document.getElementById("signinicon");
        newproductslink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/index.html#newarrivals-section";
        })
        topsellinglink.addEventListener("click", () => {
            e.preventDefault();
            window.location.href = "/index.html#topselling-section";
        })
        signinlink.addEventListener("click", (e)=>{
            e.preventDefault();
            window.location.href = "../signin/signin.html";
        })
        const mainpage_linkmobile = document.getElementById("mainpage-link_mobile");
        mainpage_linkmobile.addEventListener("click", () => {
            window.location.href = `../../index.html`;
        })
        const basketheadermobile = document.getElementById("header-basket_mobile");
        if (basketheadermobile) {
            basketheadermobile.addEventListener("click", () => {
                window.location.href = `../cart/cart.html`;
            });
        }
        const newproductslink_mobile=document.getElementById("newarrivals-link_mobile");
        const topsellinglink_mobile = document.getElementById("topselling-link_mobile");
        const signinlink_mobile = document.getElementById("signinicon_mobile");
        newproductslink_mobile.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/index.html#newarrivals-section";
        })
        topsellinglink_mobile.addEventListener("click", () => {
            e.preventDefault();
            window.location.href = "/index.html#topselling-section";
        })
        signinlink_mobile.addEventListener("click", (e)=>{
            e.preventDefault();
            window.location.href = "../signin/signin.html";
        })
        const menuinfo = document.getElementById("mobile-info");
        const menubtn = document.getElementById("menu-icon");
        const close = document.getElementById("close");
        
        menubtn.addEventListener("click", () => {
            setTimeout(() => {
                menuinfo.style.display = "flex";
                menuinfo.style.left = 0;
            }, 500);
            menubtn.style.display = "none";
            close.style.display = "block";
        })
        close.addEventListener("click", () => {
            setTimeout(() => {
                menuinfo.style.display = "none";
                menuinfo.style.left = 0;
                menubtn.style.display = "block";
                close.style.display = "none";
            }, 500);
         
        })
        document.addEventListener("click", (e) => {
            if (!menuinfo.contains(e.target)&&!menubtn.contains(e.target)&&!close.contains(e.target)) {
                setTimeout(() => {
                    menuinfo.style.display = "none";
                    menuinfo.style.left = 0;
                    menubtn.style.display = "block";
                    close.style.display = "none";
                }, 500);
           
            }
          });
    });

fetch('/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    });
let response_prod = [];
getProducts().then((products) => {
    response_prod = products;
   document.getElementById("shop-section").innerHTML=CreateItems(response_prod);
   addBasket();

})


function renderStars(rating) {
    const fullStar = '⭐';
    const emptyStar = '☆';
    const rounded = Math.round(rating);
    return fullStar.repeat(rounded) + emptyStar.repeat(5 - rounded);
}


function newprice(obj) {
    let newprice = '';
    if (obj.discountPercentage) {
        newprice = (obj.price * (1 - obj.discountPercentage / 100)).toFixed(2);
    }
    return newprice;
}

function CreateItems(array) {
    return array.map(prod =>
        ` <div class="prod_items" data-id=${prod.id}> <div class="prod-img"><img src="${prod.thumbnail}" alt=""> </div>
    <h3>${prod.title}</h3>  
    <p>${renderStars(prod.rating)} ${Math.round(prod.rating)}/5</p> 
   <div class="prices"> <span class="newprice">$${newprice(prod)}</span> <span class="old-price">$${prod.price}</span> <span class="discount">${prod.discountPercentage}%</span>
   <button class="basket" data-id="${prod.id}"><img src="../../images/basketicon.png" alt=""></button></div>
   
   </div>`
    ).join("");
}

function addBasket() {
    const basket_btns = document.querySelectorAll(".basket");
    const basket_count = document.getElementById("basket-count");
    let incart = JSON.parse(localStorage.getItem("incart")) || [];
    basket_count.innerText = incart.length;
    basket_btns.forEach(btn => {
        const id = parseInt(btn.dataset.id);
        const inCartItem = incart.find(item => item.id === id);
        btn.innerHTML = `<img src="../../images/${inCartItem ? "shopping-cart" : "basketicon"}.png" alt="">`;

        btn.addEventListener("click", function () {
            incart = JSON.parse(localStorage.getItem("incart")) || [];
            const index = incart.findIndex(item => item.id === id);

            if (index === -1) {
                const prod = response_prod.find(el => el.id === id);
                if (!prod) return;

                const obj = {
                    id: id,
                    count: 1,
                    oldprice: prod.price,
                    newprice: newprice(prod),
                };

                incart.push(obj);
                btn.innerHTML = `<img src="../../images/shopping-cart.png" alt="">`;
            } else {
                incart.splice(index, 1);
                btn.innerHTML = `<img src="../../images/basketicon.png" alt="">`;
            }

            localStorage.setItem("incart", JSON.stringify(incart));
            basket_count.innerText = incart.length;
        });
    });
}
document.addEventListener("click", function (e) {
    const prodItem = e.target.closest(".prod_items");
    if (e.target.closest(".basket")) return;
    if (prodItem) {
        const id = prodItem.dataset.id;
        window.location.href = `/pages/productdetail/product.html?id=${id}`;
    }
});