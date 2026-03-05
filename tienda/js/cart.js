/**
 * cart.js — Lógica de negocio del carrito (funciones puras)
 * Sin efectos secundarios, sin DOM. Fácilmente testeable.
 */

/**
 * Agrega un producto al carrito.
 * Si ya existe, incrementa la cantidad.
 * @param {Array} cart - Estado actual del carrito
 * @param {Object} product - Producto a agregar {id, nombre, precio, imagen, categoria}
 * @returns {Array} Nuevo estado del carrito
 */
const addToCart = (cart, product) => {
  if (!product || product.id === undefined || product.id === null) return cart;
  if (typeof product.precio !== 'number' || product.precio < 0) return cart;

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    );
  }
  return [...cart, { ...product, cantidad: 1 }];
};

/**
 * Elimina un producto completamente del carrito.
 * @param {Array} cart
 * @param {number|string} productId
 * @returns {Array}
 */
const removeFromCart = (cart, productId) => {
  if (productId === undefined || productId === null) return cart;
  return cart.filter(item => item.id !== productId);
};

/**
 * Incrementa la cantidad de un ítem.
 * @param {Array} cart
 * @param {number|string} productId
 * @returns {Array}
 */
const incrementQuantity = (cart, productId) => {
  if (!cart.find(item => item.id === productId)) return cart;
  return cart.map(item =>
    item.id === productId
      ? { ...item, cantidad: item.cantidad + 1 }
      : item
  );
};

/**
 * Decrementa la cantidad. Si llega a 0, elimina el ítem.
 * @param {Array} cart
 * @param {number|string} productId
 * @returns {Array}
 */
const decrementQuantity = (cart, productId) => {
  const item = cart.find(i => i.id === productId);
  if (!item) return cart;
  if (item.cantidad <= 1) return removeFromCart(cart, productId);
  return cart.map(i =>
    i.id === productId ? { ...i, cantidad: i.cantidad - 1 } : i
  );
};

/**
 * Calcula el subtotal del carrito.
 * @param {Array} cart
 * @returns {number}
 */
const calcSubtotal = (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) return 0;
  return cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
};

/**
 * Calcula el total de ítems (suma de cantidades).
 * @param {Array} cart
 * @returns {number}
 */
const calcTotalItems = (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) return 0;
  return cart.reduce((acc, item) => acc + item.cantidad, 0);
};

/**
 * Vacía el carrito.
 * @returns {Array}
 */
const clearCart = () => [];

/**
 * Calcula el IVA (19%) sobre el subtotal.
 * @param {number} subtotal
 * @returns {number}
 */
const calcTax = (subtotal) => {
  if (typeof subtotal !== 'number' || subtotal < 0) return 0;
  return Math.round(subtotal * 0.19 * 100) / 100;
};

/**
 * Calcula el total final (subtotal + IVA).
 * @param {number} subtotal
 * @returns {number}
 */
const calcTotal = (subtotal) => {
  if (typeof subtotal !== 'number' || subtotal < 0) return 0;
  return Math.round((subtotal + calcTax(subtotal)) * 100) / 100;
};

/**
 * Serializa el carrito para guardarlo en localStorage.
 * @param {Array} cart
 * @returns {string}
 */
const serializeCart = (cart) => JSON.stringify(cart);

/**
 * Deserializa el carrito desde localStorage.
 * @param {string} data
 * @returns {Array}
 */
const deserializeCart = (data) => {
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Exportar para Node (Jest) y browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    calcSubtotal,
    calcTotalItems,
    clearCart,
    calcTax,
    calcTotal,
    serializeCart,
    deserializeCart,
  };
}
