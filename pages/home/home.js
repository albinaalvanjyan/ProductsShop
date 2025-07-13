import { getProducts } from "../../shared/script.js";

fetch('../../shared/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
    });


let response_prod = [];
getProducts().then((products) => {
    response_prod = products;
    let newproducts = response_prod;
    newproducts = newproducts.sort((a, b) => new Date(b.meta.createdAt) - new Date(a.meta.createdAt));
    const newproducts_section = document.getElementById("newproducts");
    newproducts_section.innerHTML = CreateItems(newproducts);

    let topselling = response_prod;
    topselling = topselling.sort((a, b) => b.rating - a.rating);
    const topselling_section = document.getElementById("topsellings");
    topselling_section.innerHTML = CreateItems(topselling);

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
        ` <div class="prod_items"> <div class="prod-img"><img src="${prod.thumbnail}" alt=""> </div>
    <h3>${prod.title}</h3>  
    <p>${renderStars(prod.rating)} ${Math.round(prod.rating)}/5</p> 
   <div class="prices"> <span class="newprice">$${newprice(prod)}</span> <span class="old-price">$${prod.price}</span> <span class="discount">${prod.discountPercentage}%</span></div>
   <button id="basket" data-id="${prod.id}"><img src="../../public/images/basketicon.png" alt=""></button>
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
    const basket_btns = document.querySelectorAll("#basket");
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const basket_count = document.getElementById("basket-count");
    basket_btns.forEach(btn => {
        btn.addEventListener("click", function () {
            const id = parseInt(btn.dataset.id);
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


