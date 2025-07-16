import { getProducts } from "/shared/script.js";

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
           <div class="trash"  data-id="${el.id}"><img src="../../public/images/Frame (6).png" alt=""></div>
        </div>
        <div class="price-count"><span>$${el.newprice}</span>
            <button class="counting-btn">
                <img src="../../public/images/minus.png" alt="-" class="minus"  data-id="${el.id}">
                <span class="counter">${el.count}</span>
                <img src="../../public/images/plus.png" alt="+" class="plus"  data-id="${el.id}">
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

    document.querySelectorAll(".trash").forEach(el => el.addEventListener("click", (event) => {
        const id = event.target.closest(".trash").dataset.id;
        console.log(id)
        let deleteritemarray = JSON.parse(localStorage.getItem("incart")) || [];
        console.log(deleteritemarray)
        const index = deleteritemarray.findIndex(el => el.id === id);
        console.log("Index:", index);

        if (index !== -1) {
            deleteritemarray.splice(index, 1);
            localStorage.setItem("incart", JSON.stringify(deleteritemarray));
        }
        CreateCart();
    }))
}

