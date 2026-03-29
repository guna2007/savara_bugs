const API = "http://localhost:5000";
const STORAGE_KEYS = {
  CART: "cartItems",
  ADMIN: "admin",
  ADMIN_TOKEN: "adminToken",
};

function byId(id) {
  return document.getElementById(id);
}

function readInput(id, trim = true) {
  const el = byId(id);
  const value = el ? el.value : "";
  return trim ? value.trim() : value;
}

function setActionBusy(action, busy, busyText) {
  const btn = document.querySelector(`button[onclick=\"${action}()\"]`);
  if (!btn) return;
  if (!btn.dataset.originalText) {
    btn.dataset.originalText = btn.textContent;
  }
  btn.disabled = busy;
  btn.style.opacity = busy ? "0.7" : "1";
  btn.style.cursor = busy ? "not-allowed" : "pointer";
  btn.textContent = busy ? busyText : btn.dataset.originalText;
}

function getCartItems() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
}

function setCartItems(items) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");
});

/* LOGIN */
async function userLogin() {
  const usernameValue = readInput("username");
  const passwordValue = readInput("password", false);

  if (!usernameValue || !passwordValue) {
    alert("Enter username and password");
    return;
  }

  setActionBusy("userLogin", true, "Signing in...");
  try {
    const res = await fetch(API + "/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue,
      }),
    });

    const data = await res.json();
    if (data.success) {
      window.location.href = "home.html";
      return;
    }

    alert(data.message || "Login failed");
  } catch {
    alert("Unable to connect to server");
  } finally {
    setActionBusy("userLogin", false, "Signing in...");
  }
}

/* REGISTER */
async function register() {
  const cleanUsername = readInput("username");
  const cleanPassword = readInput("password", false);

  if (cleanUsername.length < 3 || cleanPassword.length < 4) {
    alert(
      "Username must be at least 3 characters and password at least 4 characters",
    );
    return;
  }

  setActionBusy("register", true, "Registering...");
  try {
    const res = await fetch(API + "/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: cleanUsername,
        password: cleanPassword,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      alert(data.message || "Registration failed");
      return;
    }

    window.location.href = "login.html";
  } catch {
    alert("Unable to connect to server");
  } finally {
    setActionBusy("register", false, "Registering...");
  }
}

/* PRODUCTS */
async function loadProducts() {
  const list = document.getElementById("list");
  const emptyProducts = document.getElementById("emptyProducts");

  if (!list) return;
  list.innerHTML = "";
  const isAdminProductsPage = !!byId("name") && !!byId("price");

  try {
    const res = await fetch(API + "/api/products");
    const data = await res.json();
    const products = Array.isArray(data) ? data : [];

    if (emptyProducts) {
      emptyProducts.style.display = products.length ? "none" : "block";
    }

    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product";

      const title = document.createElement("h4");
      title.textContent = p.name;

      const price = document.createElement("p");
      price.textContent = `₹${p.price}`;

      const btn = document.createElement("button");
      if (isAdminProductsPage) {
        btn.textContent = "Delete";
        btn.addEventListener("click", () => deleteProduct(p.id));
      } else {
        btn.textContent = "Cart";
        btn.addEventListener("click", () => addToCart(p.id, p.name, p.price));
      }

      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(btn);
      list.appendChild(card);
    });
  } catch {
    if (emptyProducts) {
      emptyProducts.textContent = "Unable to load products right now";
      emptyProducts.style.display = "block";
    }
  }
}

/* CART */
function addToCart(id, name, price) {
  const cart = getCartItems();
  cart.push({ id, name, price });
  setCartItems(cart);
}

function removeFromCart(index) {
  const cart = getCartItems();
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  setCartItems(cart);
  renderCartPage();
}

function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.CART);
  renderCartPage();
}

function renderCartPage() {
  const cartItemsDiv = byId("cartItems");
  const emptyCart = byId("emptyCart");
  const totalEl = byId("cartTotal");
  const cart = getCartItems();

  if (!cartItemsDiv || !emptyCart) return;
  cartItemsDiv.innerHTML = "";
  emptyCart.style.display = cart.length ? "none" : "block";

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const title = document.createElement("p");
    title.textContent = `${item.name} ₹${item.price}`;

    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.className = "danger-btn";
    btn.addEventListener("click", () => removeFromCart(index));

    row.appendChild(title);
    row.appendChild(btn);
    cartItemsDiv.appendChild(row);
  });

  if (totalEl) {
    const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
    totalEl.textContent = `Total: ₹${total}`;
  }
}

function updateCheckoutTotal() {
  const totalEl = byId("total");
  if (!totalEl) return;
  const items = getCartItems();
  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  totalEl.textContent = `Total: ₹${total}`;
}

/* ORDER */
async function placeOrder() {
  const items = getCartItems();
  const fullName = readInput("name");
  const cardValue = readInput("card", false);

  if (!items.length) {
    alert("Cart is empty");
    return;
  }

  if (!fullName) {
    alert("Enter full name");
    return;
  }

  if (cardValue.replace(/\D/g, "").length < 12) {
    alert("Enter a valid card number");
    return;
  }

  setActionBusy("placeOrder", true, "Processing...");
  try {
    const res = await fetch(API + "/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        name: fullName,
        card: cardValue,
      }),
    });
    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Order failed");
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.CART);
    alert("Order placed!");
    window.location.href = "home.html";
  } catch {
    alert("Unable to place order right now");
  } finally {
    setActionBusy("placeOrder", false, "Processing...");
  }
}

/* ADMIN */
function checkAdmin() {
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)) {
    window.location.href = "login.html";
  }
}

function check(role) {
  if (role === "admin") checkAdmin();
}

async function addProduct() {
  checkAdmin();

  const nameInput = byId("name");
  const priceInput = byId("price");

  if (!nameInput || !priceInput) return;

  const payload = {
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
  };

  if (!payload.name || !Number.isFinite(payload.price) || payload.price <= 0) {
    alert("Enter a valid product name and price");
    return;
  }

  setActionBusy("addProduct", true, "Adding...");
  try {
    const res = await fetch(API + "/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) {
      if (res.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);
        window.location.href = "login.html";
        return;
      }
      alert(data.message || "Unable to add product");
      return;
    }

    nameInput.value = "";
    priceInput.value = "";
    loadProducts();
  } catch {
    alert("Unable to connect to server");
  } finally {
    setActionBusy("addProduct", false, "Adding...");
  }
}

async function deleteProduct(id) {
  checkAdmin();
  try {
    const res = await fetch(API + `/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-token": localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN),
      },
    });

    const data = await res.json();
    if (!data.success) {
      if (res.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN);
        window.location.href = "login.html";
        return;
      }
      alert(data.message || "Unable to delete product");
      return;
    }

    loadProducts();
  } catch {
    alert("Unable to connect to server");
  }
}

async function adminLogin() {
  const usernameValue = readInput("username");
  const passwordValue = readInput("password", false);

  if (!usernameValue || !passwordValue) {
    alert("Enter admin username and password");
    return;
  }

  setActionBusy("adminLogin", true, "Signing in...");
  try {
    const res = await fetch(API + "/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue,
      }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem(STORAGE_KEYS.ADMIN, "true");
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
      window.location.href = "dashboard.html";
      return;
    }

    alert(data.message || "Admin login failed");
  } catch {
    alert("Unable to connect to server");
  } finally {
    setActionBusy("adminLogin", false, "Signing in...");
  }
}
