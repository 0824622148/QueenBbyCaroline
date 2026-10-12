# Queen B by Caroline’s — Website, Booking & Store (front-end demo)

Responsive demo site for Queen B by Caroline’s (hair, nails & beauty, Mondeor, Johannesburg).
Front end only: no backend, no payments. Built from the Claude Design “Queen B Website” spec.

## Run it
No build step. Either open `index.html` in a browser, or serve the folder:

```bash
npx serve .            # or: python -m http.server 8000
```

It works on GitHub Pages as-is (Settings → Pages → deploy from `main`, root).

## What’s included
- Home/hero, highlights, services carousel, Our Story, lookbook (filterable), team, footer
- **Online booking**: 5-step wizard (Service → Stylist → Date & Time → Details → Confirm) with a live calendar, past dates and taken slots disabled, SA phone validation and a booking reference
- **Shop**: search, category filters, wishlist, product detail with gallery & quantity
- **Cart & checkout**: slide-out cart, qty/remove, free delivery threshold, collect-in-salon or delivery, demo order confirmation
- Mobile: hamburger menu, bottom tab bar, sticky Add to Cart

Cart, wishlist, bookings and orders are saved in the browser’s `localStorage` (keys `qb.*`). Clear site data to reset the demo.

## Editing content
All content (services, prices, staff, products, lookbook) lives in [`js/data.js`](js/data.js).

## Placeholders to confirm with the client
- Service prices and durations (nails, lashes and treatments are shown as “from” prices)
- Leave-in Conditioner (R189) and Edge Control (R149) prices; all product ratings
- Delivery fee (R80, free over R500)
- Opening hours and time slots (currently 09:00–16:00, every day; “taken” slots are simulated)
- A Lashes & Beauty photo (currently a branded placeholder)

## Going live (next phase)
Booking storage + SMS/WhatsApp/email confirmations, a payment gateway (PayFast / Yoco), stock management and an admin view.

## Structure
```
index.html        page markup
css/styles.css    design tokens + styles
js/data.js        site content
js/app.js         UI logic (booking, shop, cart, checkout)
assets/img/       photography & product images
assets/brand/     logos
```
