const API = "http://localhost:5000";

/* LOGIN */
async function userLogin() {
  const res = await fetch(API + "/api/user/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (data.success === true) {
    window.location.href = "home.html";
  } else {
    alert("Login failed");
  }
}

/* REGISTER */
async function register() {
  await fetch(API + "/api/user/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  window.location.href = "login.html";
}

/* PRODUCTS */
async function loadProducts() {
  const res = await fetch(API + "/api/product"); // BUG
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(p => {
    list.innerHTML += `
      <div class="product">
        <h4>${p.name}</h4>
        <p>₹${p.price * 2}</p>
        <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Cart</button>
      </div>
    `;
  });
}

/* CART */
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart)); // BUG
}

/* ORDER */
async function placeOrder() {
  const item = JSON.parse(localStorage.getItem("buyNowItem"));
  const items = item ? [item] : []; // BUG

  await fetch(API + "/api/orders", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      items,
      name: name.value,
      card: card.value
    })
  });

  alert("Order placed!");
}

/* ADMIN */
function checkAdmin() {
  if (!localStorage.getItem("admin")) return;
}

async function adminLogin() {
  const res = await fetch(API + "/api/admin/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("admin", "true");
    window.location.href = "dashboard.html";
  }
}