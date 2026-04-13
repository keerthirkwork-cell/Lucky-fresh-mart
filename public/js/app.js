// ============================================================
//  Lucky Fresh Mart – Main App JS
// ============================================================

// ===== CONFIG =====
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with actual number e.g. 919876543210

// ===== STATE =====
let cart = {};
let currentFilter = "all";
let allProducts = [];

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  allProducts = getProducts();
  renderOffers();
  renderProducts("all");
  setupScrollHeader();
  setupFilterBtns();
  loadCartFromStorage();
  updateCartUI();
});

// ===== WHATSAPP =====
function openWhatsApp(msg) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

function sendWhatsAppOrder() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty! Add some vegetables first.");
    return;
  }
  let msg = "Hello Lucky Fresh Mart! 🥦\nI'd like to place the following order:\n\n";
  let total = 0;
  Object.values(cart).forEach(item => {
    const subtotal = item.price * item.qty;
    msg += `• ${item.name} (${item.unit}) x${item.qty} = ₹${subtotal}\n`;
    total += subtotal;
  });
  msg += `\n*Total: ₹${total}*`;
  msg += "\n\nPlease confirm availability and delivery time. Thank you!";
  openWhatsApp(msg);
}

// ===== OFFERS =====
function renderOffers() {
  const offers = getOffers();
  const grid = document.getElementById("offers-grid");
  grid.innerHTML = offers.map(o => `
    <div class="offer-card">
      <div class="offer-emoji">${o.emoji}</div>
      <div class="offer-content">
        <div class="offer-label">${o.label}</div>
        <div class="offer-name">${o.name}</div>
        <div class="offer-prices">
          <span class="offer-price-new">₹${o.offerPrice}</span>
          <span class="offer-price-old">₹${o.originalPrice}</span>
        </div>
        <button class="offer-btn" onclick="addOfferToCart(${o.id})">
          Add to Cart +
        </button>
      </div>
      <div class="offer-badge">${o.discount}</div>
    </div>
  `).join("");
}

function addOfferToCart(offerId) {
  const offers = getOffers();
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return;
  const product = { id: `offer_${offer.id}`, name: offer.name + " (Deal)", emoji: offer.emoji, unit: "per kg", price: offer.offerPrice };
  addToCart(product);
}

// ===== PRODUCTS =====
function renderProducts(cat) {
  const grid = document.getElementById("products-grid");
  const products = allProducts.filter(p => cat === "all" || p.cat === cat);

  if (products.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-soft)">No products in this category yet.</div>`;
    return;
  }

  grid.innerHTML = products.map(p => {
    const inCart = cart[p.id];
    const cartQty = inCart ? inCart.qty : 0;
    return `
    <div class="product-card" id="card-${p.id}">
      <div class="product-img-wrap">
        <span style="font-size:3.5rem">${p.emoji}</span>
        ${p.organic ? `<div class="product-organic-tag">Organic</div>` : ""}
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-unit">${p.unit}</div>
        <div class="product-footer">
          <div class="product-price">₹${p.price}</div>
          ${cartQty === 0 ? `
            <button class="add-to-cart" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})" title="Add to cart">+</button>
          ` : `
            <div style="display:flex;align-items:center;gap:6px">
              <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
              <span class="qty-val">${cartQty}</span>
              <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
            </div>
          `}
        </div>
      </div>
    </div>`;
  }).join("");
}

function setupFilterBtns() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.cat;
      renderProducts(currentFilter);
    });
  });
}

// ===== CART =====
function addToCart(product) {
  const key = product.id;
  if (cart[key]) {
    cart[key].qty++;
  } else {
    cart[key] = { ...product, qty: 1 };
  }
  saveCartToStorage();
  updateCartUI();
  renderProducts(currentFilter);

  // Quick toast
  showToast(`${product.emoji} ${product.name} added!`);
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCartToStorage();
  updateCartUI();
  renderProducts(currentFilter);
}

function clearCart() {
  cart = {};
  saveCartToStorage();
  updateCartUI();
  renderProducts(currentFilter);
  toggleCart();
}

function updateCartUI() {
  const items = Object.values(cart);
  const totalCount = items.reduce((s, i) => s + i.qty, 0);
  const totalAmt = items.reduce((s, i) => s + i.price * i.qty, 0);

  const cartItemsEl = document.getElementById("cart-items");
  const cartFooterEl = document.getElementById("cart-footer");
  const cartCountEl = document.getElementById("cart-count");
  const cartFab = document.getElementById("cart-fab");
  const totalAmtEl = document.getElementById("cart-total-amt");

  cartCountEl.textContent = totalCount;
  cartFab.style.display = totalCount > 0 ? "block" : "none";

  if (items.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.<br/>Add vegetables to start!</div>`;
    cartFooterEl.style.display = "none";
  } else {
    cartFooterEl.style.display = "block";
    totalAmtEl.textContent = `₹${totalAmt}`;
    cartItemsEl.innerHTML = items.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-unit">${item.unit}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <div class="cart-item-price">₹${item.price * item.qty}</div>
      </div>
    `).join("");
  }
}

function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("open");
}

function saveCartToStorage() {
  try { localStorage.setItem("lfm_cart", JSON.stringify(cart)); } catch {}
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("lfm_cart");
    if (saved) cart = JSON.parse(saved);
  } catch {}
}

// ===== HEADER SCROLL =====
function setupScrollHeader() {
  const header = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("open");
}

// Close menu on nav click
document.querySelectorAll("#nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav-links").classList.remove("open");
  });
});

// ===== TOAST =====
function showToast(msg) {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
    background:var(--green-dark); color:white;
    padding:12px 24px; border-radius:25px;
    font-size:0.875rem; font-weight:500;
    z-index:2000; box-shadow:0 4px 20px rgba(0,0,0,0.2);
    animation: fadeUp 0.3s ease forwards;
    white-space:nowrap;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
