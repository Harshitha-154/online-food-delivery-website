const products = [
  {
    id: "bbq-burger",
    name: "Loaded BBQ Burger",
    price: 14.9,
    description: "Beef patty, caramelized onions, cheddar, smoky sauce.",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "taco-bowl",
    name: "Taco Crunch Bowl",
    price: 12.5,
    description: "Rice, grilled chicken, avocado, salsa, and lime crema.",
    tag: "Healthy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pasta-plate",
    name: "Creamy Tomato Pasta",
    price: 13.2,
    description: "Pasta tossed in garlic tomato cream with basil.",
    tag: "Comfort",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "fries-box",
    name: "Crispy Fries Box",
    price: 5.2,
    description: "Golden crinkle fries with house seasoning.",
    tag: "Snack",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "choco-shake",
    name: "Choco Fudge Shake",
    price: 6.4,
    description: "Cold, creamy, and topped with whipped cream.",
    tag: "Dessert",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "veggie-wrap",
    name: "Garden Wrap",
    price: 10.8,
    description: "Crisp veggies, hummus, and grilled halloumi.",
    tag: "Vegan Friendly",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
  }
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function getCart() {
  const data = localStorage.getItem("biterush-cart");
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem("biterush-cart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("#cart-count").forEach((el) => {
    el.textContent = count;
  });
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;

  const featured = products.slice(0, 3);
  container.innerHTML = featured.map(renderProductCard).join("");
}

function renderProducts() {
  const container = document.getElementById("products-grid");
  if (!container) return;
  container.innerHTML = products.map(renderProductCard).join("");
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <img class="product-image" src="${product.image}" alt="${product.name}" />
      <div class="product-content">
        <p class="eyebrow">${product.tag}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          <span class="price">${currency.format(product.price)}</span>
          <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `;
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  if (!container || !summary) return;

  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = '<div class="empty-state">Your cart is empty. Add a few delicious items to get started.</div>';
    summary.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${currency.format(0)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${currency.format(0)}</span></div>
    `;
    return;
  }

  container.innerHTML = cart.map((item) => {
    const product = getProductById(item.id);
    return `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong>
          <div class="summary-row"><span>${currency.format(product.price)} each</span></div>
        </div>
        <div class="cart-actions">
          <button class="qty-btn" data-action="decrease" data-product-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="increase" data-product-id="${item.id}">+</button>
        </div>
      </div>
    `;
  }).join("");

  const subtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + product.price * item.qty;
  }, 0);

  summary.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>${currency.format(subtotal)}</span></div>
    <div class="summary-row"><span>Delivery</span><span>${currency.format(3.5)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${currency.format(subtotal + 3.5)}</span></div>
  `;
}

function addToCart(id) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  renderCart();
  renderCheckoutSummary();
}

function changeQuantity(id, delta) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (!existing) return;

  existing.qty += delta;
  if (existing.qty <= 0) {
    const index = cart.findIndex((item) => item.id === id);
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkout-summary");
  if (!container) return;

  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = '<p class="empty-state">Add items before checkout.</p>';
    return;
  }

  const subtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + product.price * item.qty;
  }, 0);

  container.innerHTML = `
    ${cart.map((item) => {
      const product = getProductById(item.id);
      return `<div class="summary-row"><span>${item.qty} × ${product.name}</span><span>${currency.format(product.price * item.qty)}</span></div>`;
    }).join("")}
    <div class="summary-row"><span>Delivery</span><span>${currency.format(3.5)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${currency.format(subtotal + 3.5)}</span></div>
  `;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();
  const message = document.getElementById("checkout-message");
  if (!message) return;

  const form = event.target;
  const name = form.name.value.trim();
  const delivery = form.delivery.value;
  const payment = form.payment.value;

  if (!name) {
    message.textContent = "Please enter your name before placing the order.";
    return;
  }

  if (!getCart().length) {
    message.textContent = "Your basket is empty. Add food before ordering.";
    return;
  }

  const paymentText = payment === "cash"
    ? "cash on delivery"
    : payment === "gpay"
      ? "processed with GPay"
      : "processed securely";

  message.textContent = `Order placed for ${name}! ${delivery === "pickup" ? "Pickup" : "Delivery"} is scheduled and payment will be ${paymentText}.`;
  localStorage.removeItem("biterush-cart");
  updateCartCount();
  renderCart();
  renderCheckoutSummary();
  form.reset();
}

function attachEvents() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart");
    if (button) {
      addToCart(button.dataset.productId);
      return;
    }

    const qtyButton = event.target.closest(".qty-btn");
    if (qtyButton) {
      changeQuantity(qtyButton.dataset.productId, qtyButton.dataset.action === "increase" ? 1 : -1);
    }
  });

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeaturedProducts();
  renderProducts();
  renderCart();
  renderCheckoutSummary();
  attachEvents();
});
