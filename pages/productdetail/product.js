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
        const newproductslink=document.getElementById("newarrivals-link");
        const topsellinglink=document.getElementById("topselling-link");
        const shoplink = document.getElementById("shop-link");
        const signinlink=document.getElementById("signinicon");

        newproductslink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/index.html#newarrivals-section";
        })
        topsellinglink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/index.html#topselling-section";
        })
        shoplink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "../shop/shop.html";
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
        const shoplink_mobile = document.getElementById("shop-link_mobile");

        shoplink_mobile.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "../shop/shop.html";
        })
        newproductslink_mobile.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/index.html#newarrivals-section";
        })
        topsellinglink_mobile.addEventListener("click", (e) => {
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
    CreateProduct(response_prod);
})

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
let count = 1;
let imagesarray = [];
function CreateProduct() {
    const prod = response_prod.find(el => el.id == productId);
    const productsection = document.getElementById("product-section");
    imagesarray = prod.images || [];
    productsection.innerHTML = `<div class="product-block">
   <div class="other-images">${imagesarray.map((el, i) =>
        `<div class="other-images_items"><img src="${el}" id=${i}></div>`
    ).join("")}</div>
    <div class="product_img"><img id="main-img" src="${prod.thumbnail}" alt=""></div>
    <div class="product-info">
        <h3>${prod.title}</h3>
        <p>${renderStars(prod.rating)} ${Math.round(prod.rating)}/5</p>
        <div class="prices"> <span class="newprice">$${newprice(prod)}</span> <span
                class="old-price">$${prod.price}</span> <span class="discount">${prod.discountPercentage}%</span></div>
        <p>${prod.description}</p>
<div class="btns"><button id="counting-btn"><img src="../../images/minus.png" alt="" id="minus"><span id="counter">1</span><img src="../../images/plus.png" alt="" id="plus"></button> <button id="addtocart-btn">Add to Cart</button></div>
    </div>
</div>`;
    document.querySelectorAll(".other-images_items").forEach((el, i) => {
        el.addEventListener("click", function (item) {
            const mainImage = document.getElementById("main-img");
            mainImage.src = imagesarray[i];
            document.querySelectorAll(".other-images_items").forEach(item => {
                item.classList.remove("active");
            });
            el.classList.add("active");
        })
    })


    document.getElementById("counter").textContent = count;
    const basket_count = document.getElementById("basket-count");
    basket_count.innerText = count;


    document.getElementById("minus").addEventListener("click", () => {
        if (count > 1) {
            count--;
            document.getElementById("counter").textContent = count;
    basket_count.innerText = count;

            localStorage.setItem("count", count);
        }
    });
    document.getElementById("plus").addEventListener("click", () => {
        count++;
        document.getElementById("counter").textContent = count;
        localStorage.setItem("count", count);
    basket_count.innerText = count;
    });
   
    let incart = JSON.parse(localStorage.getItem("incart")) || [];
    document.getElementById("addtocart-btn").addEventListener("click", () => {
        let obj = {
            count: count,
            id: productId,
            oldprice: prod.price,
            newprice: newprice(prod),
        }
        incart.push(obj)
        localStorage.setItem("incart", JSON.stringify(incart));
        
    })
}
  
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
