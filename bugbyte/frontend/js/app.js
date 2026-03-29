const API = "http://localhost:5000";
const STORAGE_KEYS = {
  CART: "cartItems",
  ADMIN: "admin",
  ADMIN_TOKEN: "adminToken",
};

/* LOGIN */
async function userLogin() {
  const res = await fetch(API + "/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });

  const data = await res.json();

  if (data.success) {
    window.location.href = "home.html";
  } else {
    alert("Login failed");
  }
}

/* REGISTER */
async function register() {
  const cleanUsername = username.value.trim();
  const cleanPassword = password.value;

  if (cleanUsername.length < 3 || cleanPassword.length < 4) {
    alert(
      "Username must be at least 3 characters and password at least 4 characters",
    );
    return;
  }

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
}

/* PRODUCTS */
async function loadProducts() {
  const res = await fetch(API + "/api/products");
  const data = await res.json();
  const products = Array.isArray(data) ? data : [];

  const list = document.getElementById("list");
  const emptyProducts = document.getElementById("emptyProducts");

  if (!list) return;
  list.innerHTML = "";

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
    btn.textContent = "Cart";
    btn.addEventListener("click", () => addToCart(p.id, p.name, p.price));

    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(btn);
    list.appendChild(card);
  });
}

/* CART */
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
  cart.push({ id, name, price });
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

/* ORDER */
async function placeOrder() {
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];

  if (!items.length) {
    alert("Cart is empty");
    return;
  }

  await fetch(API + "/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      name: name.value,
      card: card.value,
    }),
  });

  localStorage.removeItem(STORAGE_KEYS.CART);
  alert("Order placed!");
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

  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");

  if (!nameInput || !priceInput) return;

  const payload = {
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
  };

  if (!payload.name || !Number.isFinite(payload.price) || payload.price <= 0) {
    alert("Enter a valid product name and price");
    return;
  }

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
    alert(data.message || "Unable to add product");
    return;
  }

  nameInput.value = "";
  priceInput.value = "";
  loadProducts();
}

async function adminLogin() {
  const res = await fetch(API + "/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem(STORAGE_KEYS.ADMIN, "true");
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.message || "Admin login failed");
  }
}
