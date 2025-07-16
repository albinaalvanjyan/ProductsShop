import { getProducts } from "/public/shared/script.js";

fetch('/public/shared/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
    });

fetch('/public/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    });


let response_prod = [];
let reviewsratings = [];
getProducts().then((products) => {
    response_prod = products;
    let newproducts = [...response_prod].sort((a, b) => new Date(b.meta.createdAt) - new Date(a.meta.createdAt));
    let topselling = [...response_prod].sort((a, b) => b.rating - a.rating);
    let happycustomers = [...response_prod];
    reviewsratings = happycustomers.flatMap(el => el.reviews.map(
        item => item
    )).sort((a, b) => b.rating - a.rating);
    reviewsratings = reviewsratings.filter(el => el.rating >= 4);
    const newproducts_section = document.getElementById("newproducts");
    newproducts_section.innerHTML = CreateItems(newproducts);

    const topselling_section = document.getElementById("topsellings");
    topselling_section.innerHTML = CreateItems(topselling);

    const customers_slider = document.getElementById("customers-slider");
    customers_slider.innerHTML = CreateSlider(reviewsratings);

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
   <div class="prices"> <span class="newprice">$${newprice(prod)}</span> <span class="old-price">$${prod.price}</span> <span class="discount">${prod.discountPercentage}%</span></div>
   <button class="basket" data-id="${prod.id}"><img src="../../public/images/basketicon.png" alt=""></button>
   </div>`
    ).join("");
}


const viewall_btn_newprod = document.getElementById("viewall-btn_newprod");
viewall_btn_newprod.addEventListener("click", function () {
    const items = document.querySelectorAll("#newproducts > *:nth-child(n+5)");
    if (viewall_btn_newprod.innerHTML === "Return") {
        items.forEach(item => {
            setTimeout(() => {
                item.style.display = "none";
                viewall_btn_newprod.innerHTML = "View All";
            }, 500)
        });
        return;
    }
    items.forEach(item => {
        setTimeout(() => {
            item.style.display = "block";
            viewall_btn_newprod.innerHTML = "Return";
        }, 500)
    });
})

const viewall_btn_topsell = document.getElementById("viewall-btn_topsell");
viewall_btn_topsell.addEventListener("click", function () {
    const items = document.querySelectorAll("#topsellings > *:nth-child(n+5)");
    if (viewall_btn_topsell.innerHTML === "Return") {
        items.forEach(item => {
            setTimeout(() => {
                item.style.display = "none";
                viewall_btn_topsell.innerHTML = "View All";
            }, 500)
        });
        return;
    }
    items.forEach(item => {
        setTimeout(() => {
            item.style.display = "block";
            viewall_btn_topsell.innerHTML = "Return";
        }, 500)
    });
})


function addBasket() {
    const basket_btns = document.querySelectorAll(".basket");
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const basket_count = document.getElementById("basket-count");
    basket_count.innerText = products.length;

    basket_btns.forEach(btn => {
        const id = parseInt(btn.dataset.id);
        if (products.includes(id)) {
            btn.innerHTML = `<img src="../../public/images/shopping-cart.png" alt="">`;
        } else {
            btn.innerHTML = `<img src="../../public/images/basketicon.png" alt="">`;
        }
        btn.addEventListener("click", function () {


            if (!products.includes(id)) {
                btn.innerHTML = "";
                setTimeout(() => {
                    btn.innerHTML = `<img src=../../public/images/shopping-cart.png alt="">`;
                }, 500)
                products.push(id);
            } else {
                btn.innerHTML = "";
                setTimeout(() => {
                    btn.innerHTML = `<img src="../../public/images/basketicon.png" alt="">`;
                }, 500)
                products = products.filter(pid => pid !== id);
            }
            localStorage.setItem("products", JSON.stringify(products));
            basket_count.innerText = products.length;
        })
    })
}

function CreateSlider(array) {
    return array.map(el =>
        `<div class="review">
            <span>${renderStars(el.rating)}</span>
<h3>${el.reviewerName} <img src="../../public/images/Vector (13).png" alt=""></h3>
        <p>${el.comment}</p>
    </div>`
    ).join("")
}
const leftarrow = document.getElementById("left-arrow");
const rightarrow = document.getElementById("right-arrow");
const carousel = document.getElementById("customers-slider");


leftarrow.addEventListener("click", SliderLeft);
rightarrow.addEventListener("click", SliderRigth);

let position = 0;
let slideWidth = 420;

function SliderLeft() {
    const maxScroll = (reviewsratings.length - 1) * slideWidth;
    position -= slideWidth;
    if (position < 0) {
        position = maxScroll;
    }
    carousel.style.right = `${position}px`;
}

function SliderRigth() {
    const maxScroll = (reviewsratings.length - 1) * slideWidth;
    position += slideWidth;
    if (position > maxScroll) {
        position = 0;
    }
    carousel.style.right = `${position}px`;
}

document.addEventListener("click", function (e) {
    const prodItem = e.target.closest(".prod_items");
    if (e.target.closest(".basket")) return;
    if (prodItem) {
        const id = prodItem.dataset.id;
        window.location.href = `../productdetail/product.html?id=${id}`;
    }
});
const basketheader= document.getElementById("header-basket");
basketheader.addEventListener("click", ()=>{
    window.location.href = `../cart/cart.html`;
})
