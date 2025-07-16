import { getProducts } from "/shared/script.js";

fetch('/shared/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
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
let count =1;
let imagesarray = [];
function CreateProduct() {
    const prod = response_prod.find(el => el.id == productId);
    const productsection = document.getElementById("product-section");
    imagesarray = prod.images||[];
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
<div class="btns"><button id="counting-btn"><img src="../../public/images/minus.png" alt="" id="minus"><span id="counter">1</span><img src="../../public/images/plus.png" alt="" id="plus"></button> <button id="addtocart-btn">Add to Cart</button></div>
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

    document.getElementById("minus").addEventListener("click", () => {
        if (count > 1) {
            count--;
            document.getElementById("counter").textContent = count;
            localStorage.setItem("count", count);
        }
    });
    document.getElementById("plus").addEventListener("click", () => {
        count++;
        document.getElementById("counter").textContent = count;
        localStorage.setItem("count", count);
    });
    const basketheader= document.getElementById("header-basket");
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
        basket_count.innerText=count;
    })
    basketheader.addEventListener("click", ()=>{
         window.location.href = `../cart/cart.html`;
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
