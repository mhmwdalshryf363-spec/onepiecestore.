/* ==========================================
   One Piece Store
   script.js
========================================== */

// Loader
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.display = "none";
    }
});

// عناصر الصفحة
const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("searchInput");

const cart = document.getElementById("cart");
const cartBtn = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");

const topBtn = document.getElementById("topBtn");

// بيانات المنتجات
let products = [];

// بيانات السلة
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

/* ==========================================
   Cart Open / Close
========================================== */

cartBtn.addEventListener("click", () => {
    cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
    cart.classList.remove("active");
});

/* ==========================================
   Back To Top
========================================== */

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {
        topBtn.style.display = "flex";
    } else {
        topBtn.style.display = "none";
    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

/* ==========================================
   Load Products
========================================== */

async function loadProducts() {

    try {

        const response = await fetch("products.json");

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        console.error("خطأ في تحميل المنتجات", error);

    }

}

loadProducts();

/* ==========================================
   Display Products
========================================== */

function displayProducts(items) {

    productsContainer.innerHTML = "";

    items.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card fade-in";

        card.innerHTML = `
        
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>

        <span class="product-badge">
            ${product.badge}
        </span>

        <div class="product-info">

            <h3 class="product-title">
                ${product.name}
            </h3>

            <p class="product-description">
                ${product.description}
            </p>

            <div class="price-box">

                <span class="current-price">
                    $${product.price}
                </span>

                <span class="old-price">
                    $${product.oldPrice}
                </span>

            </div>

            <div class="rating">

                ⭐⭐⭐⭐⭐

                <span>

                    (${product.rating})

                </span>

            </div>

            <div class="product-buttons">

                <a href="${product.link}"
                   target="_blank"
                   class="buy-btn">

                   شراء الآن

                </a>

                <button
                    class="cart-btn"
                    onclick="addToCart(${product.id})">

                    إضافة للسلة

                </button>

            </div>

        </div>

        `;

        productsContainer.appendChild(card);

    });

}
/* ==========================================
   Search Products
========================================== */

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase().trim();

        const filtered = products.filter(product =>

            product.name.toLowerCase().includes(value) ||

            product.description.toLowerCase().includes(value)

        );

        displayProducts(filtered);

    });

}

/* ==========================================
   Categories Filter
========================================== */

const categoryButtons = document.querySelectorAll(".categories button");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "all") {

            displayProducts(products);

        } else {

            const filtered = products.filter(product =>
                product.category === category
            );

            displayProducts(filtered);

        }

    });

});

/* ==========================================
   Add To Cart
========================================== */

function addToCart(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const existing = cartItems.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cartItems.push({

            ...product,

            quantity: 1

        });

    }

    saveCart();

    updateCart();

}

/* ==========================================
   Save Cart
========================================== */

function saveCart() {

    localStorage.setItem(

        "cart",

        JSON.stringify(cartItems)

    );

}

/* ==========================================
   Start Cart
========================================== */

updateCart();
/* ==========================================
   Update Cart
========================================== */

function updateCart() {

    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    cartItemsContainer.innerHTML = "";

    let total = 0;
    let count = 0;

    cartItems.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        cartItemsContainer.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h4 class="cart-item-title">
                    ${item.name}
                </h4>

                <p class="cart-item-price">
                    $${item.price}
                </p>

                <p>
                    الكمية : ${item.quantity}
                </p>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${item.id})">

                    حذف

                </button>

            </div>

        </div>

        `;

    });

    cartCount.textContent = count;
    cartTotal.textContent = "$" + total.toFixed(2);

    saveCart();

}

/* ==========================================
   Remove From Cart
========================================== */

function removeFromCart(id) {

    cartItems = cartItems.filter(item => item.id !== id);

    updateCart();

}

/* ==========================================
   Checkout
========================================== */

const checkoutBtn = document.getElementById("checkout");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

        if (cartItems.length === 0) {

            alert("السلة فارغة.");

            return;

        }

        alert("شكراً لك ❤️ سيتم توفير نظام الطلب قريباً.");

    });

}

/* ==========================================
   Initialize
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    updateCart();

});
