# KnightCode - Publish README

## Project Name
- Current name: KnightCode
- package.json name: knightcode

## What was done
- Fixed all Easy, Medium, Hard, and Very Hard bugs.
- Improved UI to be clean and simple.
- Kept existing app flow and core behavior.
- Added later features: cart item delete, clear cart, more default products, smoother UX actions.

## Bugs Summary with exact file and section

### Easy Bugs (UI)
1. Password fields visible
- Files: frontend/user/login.html, frontend/user/register.html, frontend/admin/login.html
- Section changed: password input fields (`type="password"`)

2. Incorrect placeholders
- Files: frontend/user/login.html, frontend/user/register.html, frontend/user/checkout.html, frontend/admin/login.html, frontend/admin/products.html
- Section changed: input placeholder text

3. Broken links due to wrong file extension
- Files: frontend/user/login.html, frontend/user/register.html, frontend/user/home.html
- Section changed: anchor link href values (`.html`)

4. Incorrect empty-state messages
- Files: frontend/user/home.html, frontend/user/cart.html, frontend/js/app.js
- Section changed: `#emptyProducts`, `#emptyCart`, and empty-state toggle logic in `loadProducts()` and `renderCartPage()`

5. Invisible text due to colors
- File: frontend/css/style.css
- Section changed: button colors, heading colors, hover states

6. Layout misalignment
- File: frontend/css/style.css
- Section changed: product card alignment and layout spacing

### Medium Bugs (Logic/API)
1. Login response mismatch
- Files: backend/server.js, frontend/js/app.js
- Section changed: `/api/user/login` response and `userLogin()` check

2. Incorrect API endpoints
- Files: frontend/js/app.js, frontend/admin/dashboard.html, frontend/admin/orders.html
- Section changed: fetch URLs for products and orders

3. Products fail to load
- File: frontend/js/app.js
- Section changed: `loadProducts()` fetch and render handling

4. LocalStorage key mismatches
- File: frontend/js/app.js
- Section changed: `STORAGE_KEYS` constants and cart read/write usage

5. Broken navigation/redirect logic
- Files: frontend/js/app.js, frontend/user/*.html
- Section changed: redirect checks (`checkAdmin`) and corrected links

6. Incorrect price calculations/display
- Files: frontend/js/app.js, frontend/user/cart.html, frontend/user/checkout.html
- Section changed: product/cart/checkout price display logic

7. Cart items ignored during checkout
- File: frontend/js/app.js
- Section changed: `placeOrder()` cart source logic

8. Admin dashboard data not loading
- File: frontend/admin/dashboard.html
- Section changed: dashboard fetch + safe render block

### Hard Bugs (Advanced Logic)
1. Weak input validation in registration
- Files: backend/server.js, frontend/js/app.js
- Section changed: register validation in `/api/user/register` and `register()`

2. Product creation accepts invalid data
- Files: backend/server.js, frontend/js/app.js
- Section changed: `/api/products` validation and `addProduct()` validation

3. Wrong function usage in admin pages
- Files: frontend/admin/products.html, frontend/admin/dashboard.html, frontend/admin/orders.html, frontend/js/app.js
- Section changed: admin guard calls and page action wiring

4. Inconsistent storage keys across modules
- Files: frontend/js/app.js, frontend/user/cart.html, frontend/user/checkout.html
- Section changed: cart key usage and shared helper usage

5. Incorrect conditional logic for empty states
- Files: frontend/js/app.js, frontend/user/home.html, frontend/user/cart.html
- Section changed: conditional render for empty/non-empty states

### Very Hard Bugs (Security)
1. Admin authentication bypass
- File: backend/server.js
- Section changed: `/api/admin/login` now validates both username and password

2. Missing access control on admin routes
- File: backend/server.js
- Section changed: `requireAdmin` middleware and admin route protection

3. Unprotected product APIs
- File: backend/server.js
- Section changed: `POST /api/products` and `DELETE /api/products/:id` protected with `requireAdmin`

4. Sensitive data exposure (card info)
- File: backend/server.js
- Section changed: `/api/orders` stores `cardLast4` only

5. XSS via unsafe innerHTML rendering
- Files: frontend/js/app.js, frontend/admin/dashboard.html, frontend/admin/orders.html, frontend/user/cart.html
- Section changed: replaced unsafe HTML insertions with safe DOM creation and textContent

## Features added later
1. Cart basic actions
- Files: frontend/js/app.js, frontend/user/cart.html, frontend/css/style.css
- Added: remove item, clear cart, cart total, checkout button from cart page

2. More default products
- File: backend/server.js
- Added: multiple new products in default `products` array

3. Better UX flow
- File: frontend/js/app.js
- Added: busy state on buttons, network error handling, cleaner validation messages

4. Admin product management improvement
- File: frontend/js/app.js
- Added: `deleteProduct(id)` and delete action rendering in admin products page

## Final Files touched
- bugbyte/backend/server.js
- bugbyte/frontend/js/app.js
- bugbyte/frontend/css/style.css
- bugbyte/frontend/user/login.html
- bugbyte/frontend/user/register.html
- bugbyte/frontend/user/home.html
- bugbyte/frontend/user/cart.html
- bugbyte/frontend/user/checkout.html
- bugbyte/frontend/admin/login.html
- bugbyte/frontend/admin/dashboard.html
- bugbyte/frontend/admin/products.html
- bugbyte/frontend/admin/orders.html
- bugbyte/package.json
- bugbyte/package-lock.json

## Run locally
1. Open terminal in repo/bugbyte
2. cd backend
3. npm install
4. node server.js
5. Open frontend/user/login.html in browser

## Notes
- Use `node server.js` or `npx nodemon server.js`
- Do not use `npm nodemon server.js`
