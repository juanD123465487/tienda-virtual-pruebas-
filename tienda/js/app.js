/**
 * app.js — Capa de UI / DOM
 * Separa la lógica pura (cart.js) del manejo del DOM.
 * Aplica programación funcional: map, filter, reduce, arrow functions.
 */

'use strict';

// ─── Catálogo de productos ────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, nombre: 'MacBook Pro M3',    precio: 2499, emoji: '💻', categoria: 'Laptop',   desc: 'Chip M3, 18h batería, pantalla Liquid Retina XDR' },
  { id: 2, nombre: 'iPhone 16 Pro',     precio: 1299, emoji: '📱', categoria: 'Móvil',    desc: 'A18 Pro, cámara 48MP, Dynamic Island' },
  { id: 3, nombre: 'AirPods Pro 2',     precio: 299,  emoji: '🎧', categoria: 'Audio',    desc: 'ANC adaptativo, audio espacial, USB-C' },
  { id: 4, nombre: 'iPad Air M2',       precio: 799,  emoji: '📲', categoria: 'Tablet',   desc: 'Pantalla Liquid Retina 11", compatible con Apple Pencil' },
  { id: 5, nombre: 'Apple Watch S9',    precio: 449,  emoji: '⌚', categoria: 'Wearable', desc: 'S9 SiP, Double Tap, Always-On Display' },
  { id: 6, nombre: 'Samsung 4K OLED',   precio: 1899, emoji: '🖥️', categoria: 'Monitor',  desc: '27" QD-OLED, 240Hz, 0.03ms response time' },
  { id: 7, nombre: 'Sony WH-1000XM5',  precio: 349,  emoji: '🎵', categoria: 'Audio',    desc: 'ANC líder, 30h batería, plegable' },
  { id: 8, nombre: 'Logitech MX Keys', precio: 119,  emoji: '⌨️', categoria: 'Periférico',desc: 'Multi-device, retroiluminación, ergonómica' },
  { id: 9, nombre: 'Razer DeathAdder', precio: 89,   emoji: '🖱️', categoria: 'Periférico',desc: '30K DPI, switches ópticos, RGB Chroma' },
  { id:10, nombre: 'Steam Deck OLED',   precio: 649,  emoji: '🎮', categoria: 'Gaming',   desc: 'Pantalla OLED 7.4", APU Zen2+RDNA2, 12h batería' },
  { id:11, nombre: 'DJI Mini 4 Pro',    precio: 759,  emoji: '🚁', categoria: 'Drone',    desc: '4K/60fps, omnidireccional, 34 min vuelo' },
  { id:12, nombre: 'GoPro HERO12',      precio: 399,  emoji: '📷', categoria: 'Cámara',   desc: '5.3K60, HyperSmooth 6.0, 70min batería' },
];

// ─── Estado de la app ─────────────────────────────────────────────────────────
const LS_KEY = 'techstore_cart';
let cart = [];
let activeFilter = 'Todos';

// ─── Referencias al DOM ───────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const productGrid    = $('productGrid');
const cartDrawer     = $('cartDrawer');
const cartOverlay    = $('cartOverlay');
const cartItemsEl    = $('cartItems');
const cartBadge      = $('cartBadge');
const subtotalEl     = $('subtotal');
const taxEl          = $('tax');
const totalEl        = $('total');
const toastContainer = $('toastContainer');
const cartSubtitle   = $('cartSubtitle');
const shippingMsg    = $('shippingMsg');
const shippingFill   = $('shippingFill');
const shippingCost   = $('shippingCost');

const FREE_SHIPPING_THRESHOLD = 3000; // envío gratis sobre $3000

// ─── Persistencia ─────────────────────────────────────────────────────────────
const saveCart  = () => localStorage.setItem(LS_KEY, serializeCart(cart));
const loadCart  = () => { cart = deserializeCart(localStorage.getItem(LS_KEY) || '[]'); };

// ─── Toast ─────────────────────────────────────────────────────────────────────
const showToast = (msg) => {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 2100);
};

// ─── Badge del carrito ─────────────────────────────────────────────────────────
const updateBadge = () => {
  const count = calcTotalItems(cart);
  cartBadge.textContent = count;
  cartBadge.style.display = count > 0 ? 'flex' : 'none';
  cartBadge.classList.remove('pop');
  void cartBadge.offsetWidth;
  if (count > 0) cartBadge.classList.add('pop');
};

// ─── Barra de envío gratis ────────────────────────────────────────────────────
const updateShippingBar = (sub) => {
  const pct = Math.min(100, Math.round((sub / FREE_SHIPPING_THRESHOLD) * 100));
  shippingFill.style.width = `${pct}%`;
  if (sub === 0) {
    shippingMsg.textContent = `Agrega $${FREE_SHIPPING_THRESHOLD.toLocaleString('es-CO')} para envío gratis`;
    shippingMsg.classList.remove('reached');
    shippingCost.textContent = '$15.000';
    shippingCost.classList.remove('free-shipping');
  } else if (sub >= FREE_SHIPPING_THRESHOLD) {
    shippingMsg.textContent = '🎉 ¡Tienes envío gratis!';
    shippingMsg.classList.add('reached');
    shippingCost.textContent = 'Gratis';
    shippingCost.classList.add('free-shipping');
  } else {
    const remaining = FREE_SHIPPING_THRESHOLD - sub;
    shippingMsg.textContent = `Te faltan $${remaining.toLocaleString('es-CO')} para envío gratis`;
    shippingMsg.classList.remove('reached');
    shippingCost.textContent = '$15.000';
    shippingCost.classList.remove('free-shipping');
  }
};

// ─── Renderizar totales ───────────────────────────────────────────────────────
const renderTotals = () => {
  const sub = calcSubtotal(cart);
  const tax = calcTax(sub);
  const tot = calcTotal(sub);
  subtotalEl.textContent = `$${sub.toLocaleString('es-CO')}`;
  taxEl.textContent      = `$${tax.toLocaleString('es-CO')}`;
  totalEl.textContent    = `$${tot.toLocaleString('es-CO')}`;
  updateShippingBar(sub);
  // Subtítulo del header
  const total_items = calcTotalItems(cart);
  cartSubtitle.textContent = total_items === 0
    ? '0 productos'
    : `${total_items} producto${total_items !== 1 ? 's' : ''} · $${sub.toLocaleString('es-CO')}`;
};

// ─── Renderizar ítems del carrito ─────────────────────────────────────────────
const renderCart = () => {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-ring">🛒</div>
        <div class="cart-empty-title">Carrito vacío</div>
        <div class="cart-empty-sub">Explora el catálogo y agrega<br>los productos que desees</div>
      </div>`;
    renderTotals();
    updateBadge();
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.setAttribute('data-id', item.id);
    div.innerHTML = `
      <div class="cart-item-thumb">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-cat">${item.categoria}</div>
        <div class="cart-item-name">${item.nombre}</div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Reducir cantidad">−</button>
          <div class="qty-divider"></div>
          <span class="qty-num">${item.cantidad}</span>
          <div class="qty-divider"></div>
          <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
        </div>
        <div class="cart-item-price">$${item.precio.toLocaleString('es-CO')} c/u</div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-total">$${(item.precio * item.cantidad).toLocaleString('es-CO')}</div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Eliminar ${item.nombre}">✕</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  renderTotals();
  updateBadge();
};

// ─── Renderizar catálogo ──────────────────────────────────────────────────────
const renderProducts = () => {
  const filtered = activeFilter === 'Todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.categoria === activeFilter);

  productGrid.innerHTML = '';
  filtered.forEach((p, i) => {
    const inCart = cart.find(item => item.id === p.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 50}ms`;
    card.innerHTML = `
      <div class="card-img-wrap">
        <span>${p.emoji}</span>
        <span class="card-category">${p.categoria}</span>
      </div>
      <div class="card-body">
        <div class="card-name">${p.nombre}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-price">$${p.precio.toLocaleString('es-CO')}</div>
        <button
          class="add-btn${inCart ? ' added' : ''}"
          data-id="${p.id}"
          aria-label="Agregar ${p.nombre} al carrito"
        >${inCart ? `✓ En carrito (${inCart.cantidad})` : '+ Agregar al carrito'}</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
};

// ─── Renderizar filtros ───────────────────────────────────────────────────────
const renderFilters = () => {
  const filtersEl = $('filters');
  const categories = ['Todos', ...new Set(PRODUCTS.map(p => p.categoria))];
  filtersEl.innerHTML = categories.map(cat => `
    <button class="filter-btn${cat === activeFilter ? ' active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');
};

// ─── Abrir / cerrar carrito ───────────────────────────────────────────────────
const openCart  = () => { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); };
const closeCart = () => { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); };

// ─── Event delegation ─────────────────────────────────────────────────────────

// Botones de productos
productGrid.addEventListener('click', e => {
  const btn = e.target.closest('[data-id]');
  if (!btn || !btn.classList.contains('add-btn')) return;
  const id = parseInt(btn.dataset.id);
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  cart = addToCart(cart, product);
  saveCart();
  renderProducts();
  renderCart();
  showToast(`✓ ${product.nombre} agregado`);
});

// Filtros
$('filters').addEventListener('click', e => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  activeFilter = btn.dataset.cat;
  renderFilters();
  renderProducts();
});

// Acciones en el carrito
cartItemsEl.addEventListener('click', e => {
  const btn = e.target.closest('[data-id]');
  if (!btn) return;
  const id = parseInt(btn.dataset.id);

  if (btn.classList.contains('cart-item-remove')) {
    const name = cart.find(i => i.id === id)?.nombre;
    cart = removeFromCart(cart, id);
    saveCart(); renderCart(); renderProducts();
    showToast(`✗ ${name} eliminado`);
  } else if (btn.dataset.action === 'inc') {
    cart = incrementQuantity(cart, id);
    saveCart(); renderCart(); renderProducts();
  } else if (btn.dataset.action === 'dec') {
    cart = decrementQuantity(cart, id);
    saveCart(); renderCart(); renderProducts();
  }
});

// Botón abrir carrito
$('cartBtn').addEventListener('click', openCart);
$('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Vaciar carrito
$('clearCartBtn').addEventListener('click', () => {
  if (cart.length === 0) return;
  cart = clearCart();
  saveCart(); renderCart(); renderProducts();
  showToast('🗑️ Carrito vaciado');
});

// Checkout (simulado)
$('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) return;
  showToast('✅ ¡Orden procesada! (simulación)');
  cart = clearCart();
  saveCart(); renderCart(); renderProducts();
  closeCart();
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});

// ─── Inicialización ───────────────────────────────────────────────────────────
const init = () => {
  loadCart();
  renderFilters();
  renderProducts();
  renderCart();
};

init();
