import { getProducts } from "/shared/script.js";

fetch('/shared/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
        const basketheader = document.getElementById("header-basket");
        if (basketheader) {
            basketheader.addEventListener("click", () => {
                window.location.href = `/pages/cart/cart.html`;
            });
        }
        const basketheadermobile = document.getElementById("header-basket_mobile");
        if (basketheadermobile) {
            basketheadermobile.addEventListener("click", () => {
                window.location.href = `/pages/cart/cart.html`;
            });
        }
        const mainpage_link = document.getElementById("mainpage-link");
        mainpage_link.addEventListener("click", () => {
            window.location.href = `index.html`;
        })
        const mainpage_linkmobile = document.getElementById("mainpage-link_mobile");
        mainpage_linkmobile.addEventListener("click", () => {
            window.location.href = `index.html`;
        })
        const newproductslink = document.getElementById("newarrivals-link");
        const topsellinglink = document.getElementById("topselling-link");
        const shoplink = document.getElementById("shop-link");
        const signinlink = document.getElementById("signinicon");
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
            window.location.href = "pages/shop/shop.html";
        })
        signinlink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "pages/signin/signin.html";
        })
        const newproductslink_mobile=document.getElementById("newarrivals-link_mobile");
        const topsellinglink_mobile = document.getElementById("topselling-link_mobile");
        const shoplink_mobile = document.getElementById("shop-link_mobile");
        const signinlink_mobile = document.getElementById("signinicon_mobile");
        newproductslink_mobile.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/index.html#newarrivals-section";
        })
        topsellinglink_mobile.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/index.html#topselling-section";
        })
        shoplink_mobile.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "pages/shop/shop.html";
        })
        signinlink_mobile.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "pages/signin/signin.html";
        })

        const menuinfo = document.getElementById("mobile-info");
        const menubtn = document.getElementById("menu-icon");
        const close = document.getElementById("close");
        
        menubtn.addEventListener("click", () => {
            menuinfo.style.transform = "translateX(0)";
            menubtn.style.display = "none";
            close.style.display = "block";
        })
        close.addEventListener("click", () => {
            menubtn.style.display = "block";
                close.style.display = "none";
            menuinfo.style.transform = "translateX(-100%)";
        })

          const shopnowbtn=document.getElementById("shopnowbtn");
          shopnowbtn.addEventListener("click", (e)=>{
            e.preventDefault();
            window.location.href = "pages/shop/shop.html";
          })

    });

fetch('/shared/footer.html')
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
   <div class="prices"> <span class="newprice">$${newprice(prod)}</span> <span class="old-price">$${prod.price}</span> <span class="discount">${prod.discountPercentage}%</span>
   <button class="basket" data-id="${prod.id}"><img src="../../images/basketicon.png" alt=""></button></div>
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


function CreateSlider(array) {
    return array.map(el =>
        `<div class="review">
            <span>${renderStars(el.rating)}</span>
<h3>${el.reviewerName} <img src="../../images/Vector (13).png" alt=""></h3>
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
let slideWidth=400;
let visibleslides = 3;
function SliderLeft() {
    const maxScroll = (reviewsratings.length - visibleslides) * slideWidth;
    position -= slideWidth;
    if (position < 0) {
        position = maxScroll;
    }
    carousel.style.right = `${position}px`;
}

function SliderRigth() {
    const maxScroll = (reviewsratings.length - visibleslides) * slideWidth;
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
        window.location.href = `/pages/productdetail/product.html?id=${id}`;
    }
});
