# Amazon Clone — E-Commerce Platform

A full-stack e-commerce web application replicating Amazon's design and user experience. Built as part of an SDE Intern Full-Stack Assignment.

---

## Live Demo

> Deployed link: _[Add your deployment URL here after deploying]_
> GitHub: _[Add your GitHub repo URL here]_

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js (CRA), React Router v6     |
| Backend    | Node.js + Express.js                |
| Database   | MySQL (via mysql2/promise)          |
| Styling    | Plain CSS (Amazon design system)    |
| State      | React Context API                   |
| HTTP       | Axios                               |
| Auth       | None (default user assumed)         |

---

## Features

### Core (Required)

- **Product Listing Page** — Grid layout, product cards with image / name / price / add-to-cart, search by name/brand/description, filter by category, sort by price / rating / newest
- **Product Detail Page** — Image carousel with thumbnail navigation, description, specifications table, stock status, Add to Cart + Buy Now buttons, wishlist toggle
- **Shopping Cart** — View all items, update quantity (+/-), remove items, subtotal/total with free-delivery threshold logic
- **Order Placement** — 3-step checkout (Shipping Address → Payment → Review), order confirmation page with generated Order ID

### Bonus Features

- **Order History** — View all past orders with status badges and item previews
- **Wishlist** — Add/remove products, move to cart directly from wishlist
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Category Browsing** — Sidebar filter + bottom nav strip
- **Skeleton Loading** — Shimmer placeholders while data loads

---

## Database Schema

```
users             — Default user pre-seeded (no login required)
categories        — 8 product categories
products          — 23 seed products across all categories
product_images    — Multiple images per product (carousel)
product_specs     — Key-value specification pairs
cart_items        — Per-user cart (unique constraint per product)
orders            — Order header with shipping details
order_items       — Line items snapshot at time of order
wishlist          — Per-user wishlist (toggle behavior)
```

Key design decisions:
- `order_items` stores a **snapshot** of product name/price/image at order time, so historical orders stay accurate even if the product changes later
- Cart uses `ON DUPLICATE KEY UPDATE` for upsert — adding a product already in cart increments quantity instead of creating a duplicate row
- Orders use a **DB transaction** — stock deduction, order insert, item inserts, and cart clear all happen atomically

---

## Project Structure

```
amazon-clone/
├── frontend/                   # React application
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar/         # Top nav + search + cart badge
│       │   ├── Footer/
│       │   ├── ProductCard/    # Reusable product card
│       │   └── StarRating/     # Star renderer
│       ├── context/
│       │   └── CartContext.js  # Global cart state
│       ├── pages/
│       │   ├── HomePage.js
│       │   ├── ProductListPage.js
│       │   ├── ProductDetailPage.js
│       │   ├── CartPage.js
│       │   ├── CheckoutPage.js
│       │   ├── OrderConfirmPage.js
│       │   ├── OrderHistoryPage.js
│       │   └── WishlistPage.js
│       └── services/
│           └── api.js          # All Axios API calls
│
└── backend/                    # Express REST API
    ├── config/
    │   ├── db.js               # MySQL connection pool
    │   ├── schema.sql          # Full DB schema
    │   └── seed.sql            # Sample data
    ├── routes/
    │   ├── products.js
    │   ├── cart.js
    │   ├── orders.js
    │   ├── categories.js
    │   └── users.js
    └── server.js
```

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/amazon-clone.git
cd amazon-clone
```

---

### 2. Database Setup

Open MySQL and run:

```sql
-- Create and set up the database
source backend/config/schema.sql
source backend/config/seed.sql
```

Or using the CLI:

```bash
mysql -u root -p < backend/config/schema.sql
mysql -u root -p < backend/config/seed.sql
```

---

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=amazon_clone
JWT_SECRET=change_this_to_something_random
NODE_ENV=development
```

Install dependencies and start:

```bash
npm install
npm start
# or for development with auto-reload:
# npx nodemon server.js
```

Backend will run on **http://localhost:5000**

Verify it's working:
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","message":"Server is running"}
```

---

### 4. Frontend Setup

```bash
cd frontend
cp .env.example .env
```

`.env` contents:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Install and start:

```bash
npm install
npm start
```

Frontend will run on **http://localhost:3000**

---

## API Endpoints

### Products
| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/api/products`       | List products (search, category, sort, page) |
| GET    | `/api/products/:id`   | Single product with images and specs     |

### Categories
| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | `/api/categories` | All categories    |

### Cart
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | `/api/cart`        | Get cart + summary   |
| POST   | `/api/cart`        | Add item to cart     |
| PATCH  | `/api/cart/:id`    | Update quantity      |
| DELETE | `/api/cart/:id`    | Remove single item   |
| DELETE | `/api/cart`        | Clear entire cart    |

### Orders
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/orders`         | Order history            |
| GET    | `/api/orders/:id`     | Single order detail      |
| POST   | `/api/orders`         | Place new order          |

### Wishlist
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/users/wishlist` | Get wishlist             |
| POST   | `/api/users/wishlist` | Toggle item in wishlist  |

---

## Assumptions Made

1. **No authentication required** — A default user (id=1, Rahul Sharma) is pre-seeded. All cart/order/wishlist actions operate on this user. Authentication can be added on top of the existing structure by replacing the `DEFAULT_USER_ID` constant with middleware-extracted JWT user ID.

2. **Payment simulation** — No actual payment gateway is integrated. Users can select COD, UPI, or Card — all result in a confirmed order (simulated environment).

3. **Image hosting** — Product images use Unsplash URLs for demonstration. In production, images would be stored in S3 or similar and served via CDN.

4. **Stock management** — Stock is decremented on successful order placement using a DB transaction. The UI shows a warning when stock ≤ 5.

5. **Free delivery threshold** — Orders above ₹499 qualify for free delivery, mirroring Amazon India's behavior.

---

## Deployment

### Backend — Render / Railway

1. Push the `backend/` folder contents to a separate repo or use a monorepo setup
2. Set environment variables in the platform dashboard
3. Start command: `node server.js`

### Frontend — Vercel / Netlify

1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Publish directory: `build/`

---

## Screenshots

> Add screenshots of the homepage, product listing, product detail, cart, and checkout pages here after running the app.

---

## Author

Prabhjot Singh  
B.Tech CSE, Chitkara University  
