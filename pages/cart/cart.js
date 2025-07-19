import { getProducts } from "/shared/script.js";

fetch('/shared/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
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
       
        const newproductslink_mobile=document.getElementById("newarrivals-link_mobile");
        const topsellinglink_mobile = document.getElementById("topselling-link_mobile");
        const signinlink_mobile = document.getElementById("signinicon_mobile");
        const shoplink_mobile = document.getElementById("shop-link_mobile");

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
        shoplink_mobile.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "../shop/shop.html";
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


let response_prod = []
getProducts().then((allProducts) => {
    response_prod = allProducts;

    CreateCart();
});

function CreateCart() {
    const productsarray = JSON.parse(localStorage.getItem("incart")) || [];

    if (productsarray.length === 0) {
        document.getElementById("incart-block").innerHTML = "<p>Your cart is empty.</p>";
        return;
    }


    let productMap = new Map();

    productsarray.forEach(el => {
        if (productMap.has(el.id)) {
            productMap.get(el.id).count += el.count;
        } else {
            productMap.set(el.id, { ...el });
        }
    });

    let enriched = Array.from(productMap.values()).map(el => {
        const full = response_prod.find(p => p.id == el.id);
        return {
            ...el,
            title: full?.title || "Unknown product",
            thumbnail: full?.thumbnail || "",
        };
    });

    let sum = enriched.reduce((acc, r) => acc + r.oldprice * r.count, 0);
    let newsum = enriched.reduce((acc, r) => acc + r.newprice * r.count, 0);
    const delivery = 15;
    const incartblock = document.getElementById("incart-block");
    incartblock.innerHTML = "";
    const productsincart = document.createElement("div");
    productsincart.id = "productsincart";
    productsincart.innerHTML = enriched.map(el => `
    <div class="product-item">
    <div class="prod-img"><img src="${el.thumbnail}" alt=""></div>
    <div>
        <div class="title-trashicon">
            <h3>${el.title}</h3>
           <div class="trash"  data-id="${el.id}"><img src="/images/Frame (6).png" alt=""></div>
        </div>
        <div class="price-count"><span>$${el.newprice}</span>
            <button class="counting-btn">
                <img src="/images/minus.png" alt="-" class="minus"  data-id="${el.id}">
                <span class="counter">${el.count}</span>
                <img src="/images/plus.png" alt="+" class="plus"  data-id="${el.id}">
            </button>
        </div>
    </div>
</div>
    `).join("");
    incartblock.appendChild(productsincart);
    incartblock.innerHTML += `<div class="summary">
            <h3>Order Summary</h3>
            <div class="sum_span"><span class="span-titles">SubTotal</span><span class="sum">$${sum.toFixed(2)}</span></div>
            <div class="sum_span"><span class="span-titles">Discount</span><span  class="sum" id="discount">-$${(sum - newsum).toFixed(2)}</span></div>
            <div class="sum_span"><span class="span-titles">Delivery Fee</span><span  class="sum">$${delivery.toFixed(2)}</span></div>
            <div class="sum_span" id="total"><span class="span-titles">Total</span><span  class="sum">$${(newsum + delivery).toFixed(2)}</span></div>
            <button>Go To Checkout -></button>
        </div>`;
    document.querySelectorAll(".minus").forEach(el => el.addEventListener("click", (event) => {
        let id = parseInt(event.target.dataset.id);
        let product = enriched.find(el => el.id == id);
        if (product.count > 1) {
            product.count--;
            const productItem = event.target.closest(".product-item");
            if (productItem) {
                const counter = productItem.querySelector(".counter");
                if (counter) counter.textContent = product.count;
            }
            localStorage.setItem("incart", JSON.stringify(enriched));
            sum = enriched.reduce((acc, r) => acc + r.oldprice * r.count, 0);
            newsum = enriched.reduce((acc, r) => acc + r.newprice * r.count, 0);
            document.querySelector(".summary .sum_span:nth-child(2) .sum").textContent = `$${sum.toFixed(2)}`;
            document.getElementById("discount").textContent = `-$${(sum - newsum).toFixed(2)}`;
            document.querySelector("#total .sum").textContent = `$${(newsum + delivery).toFixed(2)}`;
        }
        else if (product.count == 1) {
            deletefrombasketById(id);
        }
    }))
    document.querySelectorAll(".plus").forEach(el => el.addEventListener("click", (event) => {
        let product = enriched.find(el => el.id == parseInt(event.target.dataset.id));
        product.count++;
        const productItem = event.target.closest(".product-item");
        if (productItem) {
            const counter = productItem.querySelector(".counter");
            if (counter) counter.textContent = product.count;
            localStorage.setItem("incart", JSON.stringify(enriched));
            sum = enriched.reduce((acc, r) => acc + r.oldprice * r.count, 0);
            newsum = enriched.reduce((acc, r) => acc + r.newprice * r.count, 0);
            document.querySelector(".summary .sum_span:nth-child(2) .sum").textContent = `$${sum.toFixed(2)}`;
            document.getElementById("discount").textContent = `-$${(sum - newsum).toFixed(2)}`;
            document.querySelector("#total .sum").textContent = `$${(newsum + delivery).toFixed(2)}`;
        }
    }))

    document.querySelectorAll(".trash").forEach(el => el.addEventListener("click", deletefrombasket));
    const basket_count = document.getElementById("basket-count");
let incart = JSON.parse(localStorage.getItem("incart")) || [];

basket_count.innerText = incart.length; 

}

function deletefrombasket(event) {
    const trashEl = event.target.closest(".trash");
    if (!trashEl || !trashEl.dataset.id) return; 

    const id = trashEl.dataset.id;
    deletefrombasketById(id);
}

function deletefrombasketById(id) {
    let deleteritemarray = JSON.parse(localStorage.getItem("incart")) || [];
    const index = deleteritemarray.findIndex(el => el.id == id);
    if (index !== -1) {
        deleteritemarray.splice(index, 1);
        localStorage.setItem("incart", JSON.stringify(deleteritemarray));
    }
    CreateCart();
}
