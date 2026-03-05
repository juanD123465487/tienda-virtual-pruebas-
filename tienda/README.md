# 🛒 TechStore — Carrito de Compras

Simulación de un carrito de compras frontend desarrollado con **HTML, CSS y JavaScript puro**, con programación funcional y pruebas unitarias con >90% de cobertura.

---



## 🧪 Cómo correr las pruebas

Las pruebas están en `tests/cart.test.js` y se ejecutan con el runner personalizado incluido:

```bash
node runner.js
```

Esto ejecuta los 37 tests unitarios y muestra el reporte de cobertura en consola.

### Con Jest (si tienes Node + npm con acceso a red):
```bash
npm install --save-dev jest
npx jest --coverage
```

---

## 📊 Cómo generar el reporte de cobertura

```bash
node runner.js
```

Salida esperada:
```
  Tests ejecutados : 37
  ✓ Pasaron        : 37
  ✗ Fallaron       : 0
  Tasa de éxito    : 100%

  Functions   : 11/11  → 100%  ✅
  Lines       :  98%           ✅
  Statements  :  98%           ✅
  Branches    :  87%           ✅
  Cobertura global estimada: 96%
```

---

## 📁 Estructura del proyecto

```
/
├── index.html          ← Punto de entrada
├── runner.js           ← Test runner personalizado (sin dependencias)
├── css/
│   └── styles.css      ← Estilos (tema oscuro editorial)
├── js/
│   ├── cart.js         ← Lógica pura del carrito (funciones puras)
│   └── app.js          ← Capa DOM / UI
└── tests/
    └── cart.test.js    ← 37 pruebas unitarias
```

---

## ✅ Funcionalidades implementadas

- [x] Catálogo de 12 productos en cards con emoji, nombre, precio y descripción
- [x] Filtros por categoría (Laptop, Móvil, Audio, Gaming…)
- [x] Agregar productos al carrito (botón en cada card)
- [x] Incrementar cantidad si se agrega el mismo producto
- [x] Botones +/- dentro del carrito para ajustar cantidad
- [x] Eliminar ítem del carrito
- [x] Subtotal, IVA (19%) y Total en tiempo real
- [x] Persistencia con LocalStorage (el carrito sobrevive recargas)
- [x] Vaciar carrito completo
- [x] Badge con contador de ítems
- [x] Mensajes "Carrito vacío" y toasts de confirmación
- [x] Diseño responsive (desktop y móvil)
- [x] Animaciones suaves (CSS transitions)
- [x] Accesibilidad básica: aria-label, focus visible, ESC para cerrar

---

## 🧩 Investigación Técnica

### ¿Cómo se mide la cobertura en JavaScript?

La cobertura de código mide qué porcentaje del código fuente es ejecutado durante las pruebas. Se instrumenta el código (se inserta tracking invisible) y se registra qué líneas/ramas/funciones se ejecutaron.

### ¿Qué herramientas permiten medir cobertura?

| Herramienta | Tipo | Notas |
|-------------|------|-------|
| **Jest** (con `--coverage`) | Test runner + cobertura | Usa Istanbul internamente |
| **Istanbul / nyc** | Solo cobertura | Se puede usar con cualquier runner |
| **Vitest** | Moderno, para Vite | Compatible con API de Jest |
| **SonarQube** | Análisis estático + cobertura | Para proyectos enterprise |
| **c8** | Cobertura nativa V8 | Sin instrumentación, más preciso |

### ¿Cómo se configuran los umbrales mínimos?

En `package.json` con Jest:

```json
"jest": {
  "coverageThreshold": {
    "global": {
      "functions": 90,
      "lines": 90,
      "statements": 90,
      "branches": 80
    }
  }
}
```

Si no se alcanzan, Jest falla con código de error no-cero.

### ¿Qué significa cada tipo de cobertura?

| Tipo | Significado |
|------|-------------|
| **Functions** | % de funciones/métodos que fueron llamados al menos una vez |
| **Lines** | % de líneas de código ejecutadas |
| **Statements** | % de sentencias individuales ejecutadas (más granular que líneas) |
| **Branches** | % de ramas de decisión (if/else, ternarios, &&, \|\|) ejecutadas en ambos caminos |

### ¿Cómo puedo hacer pruebas de usabilidad?

- **Manuales**: Sesiones con usuarios reales, grabando pantalla (Lookback, Maze)
- **Herramientas**: Hotjar, Microsoft Clarity (heatmaps y grabaciones)
- **Lighthouse**: Auditoría de accesibilidad y UX automatizada en Chrome DevTools
- **axe DevTools**: Plugin para detectar problemas de accesibilidad WCAG

### ¿Cómo puedo aplicar pruebas de Carga?

- **k6**: Scripts JS para carga y performance de APIs
- **Artillery**: YAML-based, fácil de configurar
- **Locust**: Python, muy escalable
- **Para frontend**: Lighthouse CI, WebPageTest, Chrome DevTools Performance

---

## 💡 Reflexión — Partes más difíciles de cubrir

1. **Branches en `deserializeCart`**: Probar el bloque `catch` requería pasar JSON malformado; no es obvio al principio.
2. **Edge cases de `addToCart`**: Validar precios negativos y productos sin `id` requirió pensar en casos límite que no son evidentes desde la UI.
3. **Lógica de `decrementQuantity` con cantidad = 1**: El doble comportamiento (decrementar vs eliminar) es un branch que es fácil de olvidar testear.
4. **Funciones DOM en `app.js`**: La capa de UI no se puede testear unitariamente sin JSDOM o un navegador. Por eso se separó la lógica pura en `cart.js`.

---

## 📸 Vista previa

Interfaz con tema oscuro editorial, fuentes Syne + DM Mono, paleta negro/amarillo-neón con drawer lateral para el carrito.
