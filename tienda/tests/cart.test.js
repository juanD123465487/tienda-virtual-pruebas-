/**
 * cart.test.js — Pruebas unitarias para la lógica del carrito
 * Herramienta: Jest
 */

const {
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
} = require('../js/cart');

// ─── Datos de prueba ───────────────────────────────────────────────────────────
const producto1 = { id: 1, nombre: 'MacBook Pro', precio: 2500, imagen: '', categoria: 'Laptop' };
const producto2 = { id: 2, nombre: 'iPhone 15', precio: 1200, imagen: '', categoria: 'Móvil' };
const producto3 = { id: 3, nombre: 'AirPods Pro', precio: 350, imagen: '', categoria: 'Audio' };

// ─── addToCart ─────────────────────────────────────────────────────────────────
describe('addToCart', () => {
  test('agrega un producto nuevo al carrito vacío', () => {
    const result = addToCart([], producto1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].cantidad).toBe(1);
  });

  test('agrega varios productos distintos', () => {
    let cart = addToCart([], producto1);
    cart = addToCart(cart, producto2);
    expect(cart).toHaveLength(2);
  });

  test('incrementa cantidad si el producto ya existe', () => {
    let cart = addToCart([], producto1);
    cart = addToCart(cart, producto1);
    expect(cart).toHaveLength(1);
    expect(cart[0].cantidad).toBe(2);
  });

  test('no muta el carrito original', () => {
    const original = [];
    addToCart(original, producto1);
    expect(original).toHaveLength(0);
  });

  test('retorna el mismo carrito si el producto es null', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    expect(addToCart(cart, null)).toEqual(cart);
  });

  test('retorna el mismo carrito si el producto no tiene id', () => {
    const cart = [];
    expect(addToCart(cart, { nombre: 'X', precio: 10 })).toEqual(cart);
  });

  test('retorna el mismo carrito si el precio es negativo', () => {
    const cart = [];
    expect(addToCart(cart, { id: 99, nombre: 'X', precio: -5 })).toEqual(cart);
  });
});

// ─── removeFromCart ────────────────────────────────────────────────────────────
describe('removeFromCart', () => {
  test('elimina un producto existente', () => {
    const cart = [{ ...producto1, cantidad: 1 }, { ...producto2, cantidad: 2 }];
    const result = removeFromCart(cart, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  test('retorna el mismo carrito si el id no existe', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    const result = removeFromCart(cart, 99);
    expect(result).toHaveLength(1);
  });

  test('retorna el mismo carrito si productId es null', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    expect(removeFromCart(cart, null)).toEqual(cart);
  });

  test('retorna array vacío si solo había un ítem', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    expect(removeFromCart(cart, 1)).toEqual([]);
  });
});

// ─── incrementQuantity ─────────────────────────────────────────────────────────
describe('incrementQuantity', () => {
  test('incrementa cantidad del producto indicado', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    const result = incrementQuantity(cart, 1);
    expect(result[0].cantidad).toBe(2);
  });

  test('no afecta otros ítems', () => {
    const cart = [{ ...producto1, cantidad: 1 }, { ...producto2, cantidad: 3 }];
    const result = incrementQuantity(cart, 1);
    expect(result[1].cantidad).toBe(3);
  });

  test('retorna el mismo carrito si el id no existe', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    expect(incrementQuantity(cart, 99)).toEqual(cart);
  });
});

// ─── decrementQuantity ─────────────────────────────────────────────────────────
describe('decrementQuantity', () => {
  test('decrementa la cantidad', () => {
    const cart = [{ ...producto1, cantidad: 3 }];
    expect(decrementQuantity(cart, 1)[0].cantidad).toBe(2);
  });

  test('elimina el ítem si la cantidad llega a 0', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    expect(decrementQuantity(cart, 1)).toHaveLength(0);
  });

  test('retorna el mismo carrito si el id no existe', () => {
    const cart = [{ ...producto1, cantidad: 2 }];
    expect(decrementQuantity(cart, 99)).toEqual(cart);
  });
});

// ─── calcSubtotal ──────────────────────────────────────────────────────────────
describe('calcSubtotal', () => {
  test('calcula correctamente el subtotal', () => {
    const cart = [
      { ...producto1, cantidad: 1 },  // 2500
      { ...producto2, cantidad: 2 },  // 2400
    ];
    expect(calcSubtotal(cart)).toBe(4900);
  });

  test('retorna 0 para carrito vacío', () => {
    expect(calcSubtotal([])).toBe(0);
  });

  test('retorna 0 si no es array', () => {
    expect(calcSubtotal(null)).toBe(0);
  });

  test('calcula con múltiples cantidades', () => {
    const cart = [{ ...producto3, cantidad: 3 }]; // 350 * 3 = 1050
    expect(calcSubtotal(cart)).toBe(1050);
  });
});

// ─── calcTotalItems ────────────────────────────────────────────────────────────
describe('calcTotalItems', () => {
  test('suma todas las cantidades', () => {
    const cart = [
      { ...producto1, cantidad: 2 },
      { ...producto2, cantidad: 3 },
    ];
    expect(calcTotalItems(cart)).toBe(5);
  });

  test('retorna 0 para carrito vacío', () => {
    expect(calcTotalItems([])).toBe(0);
  });

  test('retorna 0 si no es array', () => {
    expect(calcTotalItems(undefined)).toBe(0);
  });
});

// ─── clearCart ─────────────────────────────────────────────────────────────────
describe('clearCart', () => {
  test('retorna un array vacío', () => {
    expect(clearCart()).toEqual([]);
  });
});

// ─── calcTax ──────────────────────────────────────────────────────────────────
describe('calcTax', () => {
  test('calcula IVA del 19%', () => {
    expect(calcTax(1000)).toBe(190);
  });

  test('retorna 0 para subtotal 0', () => {
    expect(calcTax(0)).toBe(0);
  });

  test('retorna 0 para valor negativo', () => {
    expect(calcTax(-100)).toBe(0);
  });

  test('retorna 0 si no es número', () => {
    expect(calcTax('abc')).toBe(0);
  });
});

// ─── calcTotal ─────────────────────────────────────────────────────────────────
describe('calcTotal', () => {
  test('calcula total con IVA incluido', () => {
    expect(calcTotal(1000)).toBe(1190);
  });

  test('retorna 0 para subtotal negativo', () => {
    expect(calcTotal(-50)).toBe(0);
  });

  test('retorna 0 si no es número', () => {
    expect(calcTotal(null)).toBe(0);
  });
});

// ─── serializeCart / deserializeCart ──────────────────────────────────────────
describe('serializeCart', () => {
  test('serializa correctamente a JSON', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    const result = serializeCart(cart);
    expect(typeof result).toBe('string');
    expect(JSON.parse(result)).toEqual(cart);
  });
});

describe('deserializeCart', () => {
  test('deserializa correctamente desde JSON', () => {
    const cart = [{ ...producto1, cantidad: 1 }];
    const data = JSON.stringify(cart);
    expect(deserializeCart(data)).toEqual(cart);
  });

  test('retorna array vacío para JSON inválido', () => {
    expect(deserializeCart('not-json')).toEqual([]);
  });

  test('retorna array vacío para string vacío', () => {
    expect(deserializeCart('')).toEqual([]);
  });

  test('retorna array vacío si el resultado no es array', () => {
    expect(deserializeCart(JSON.stringify({ key: 'value' }))).toEqual([]);
  });
});
