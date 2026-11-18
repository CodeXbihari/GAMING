# Hostel Gaming Hub

> A modern, premium hostel gaming equipment booking web application built with **React**, **Vite**, and **Tailwind CSS**. Designed in strict accordance with the visual identity, colour palette, typography, card elevation, and layout of the **Hostel Gaming Hub** design system.

---

## 🎨 Design System & Color Palette

- **Main Background**: `#080D0B`
- **Secondary Background**: `#0D1511`
- **Card Background**: `#111815`
- **Elevated Card Background**: `#171E1A`
- **Primary Emerald Green**: `#36D98A` (Buttons, active states, glowing badges)
- **Secondary Green**: `#16B86A`
- **Dark Green**: `#0B3D2B`
- **Premium Gold**: `#D8B45A` (Combo highlight, most popular badge)
- **Gold Border**: `#8D7845`
- **Primary Text**: `#F4F4EF`
- **Secondary Text**: `#A7ADA8`
- **Muted Text**: `#777F79`
- **Success / Warning / Error**: `#36D98A` / `#E5B84C` / `#F04444`

---

## 🖥️ Implemented Pages

### Customer Portal
1. **Homepage (Hero & Features)**
   - Brand logo with glowing emerald gamepad icon.
   - Hero: *"Your Hostel Gaming Hub — Reserve Laptops & Controllers for Your Gaming Sessions"*.
   - Rog Strix RGB gaming laptop & black wireless controller visual stage with ambient emerald backlight.
   - Bottom feature strip: 1 Hour Slots, Secure Booking, UPI & Cash Payment, Premium Equipment.
2. **Equipment Selection**
   - 3 equipment cards:
     - **Gaming Laptop** (₹50 / hr, RTX 4060, emerald "Select ->" button)
     - **Gaming Controller** (₹20 / hr, precision triggers, emerald "Select ->" button)
     - **Laptop + Controller** (₹60 / hr, gold border, "Most Popular" badge, gold "Select ->" button)
3. **Date and Time Selection**
   - Monthly interactive calendar (November 2026 with 15th Nov active highlight).
   - 3-column hourly slots grid (09:00 AM - 08:00 PM, with 11:00 AM selected).
   - Bottom equipment summary bar with duration & "Continue ->" action.
4. **Checkout**
   - Left Panel: Reservation summary (date, time, equipment, ₹50/hr) with payment method selector (UPI or Cash at Collection).
   - Right Panel: Scan & Pay with glowing QR code, UPI ID (`hostelgaming@okaxis`), copy button, UTR number input, upload payment proof, and submit action.
5. **Booking Confirmed**
   - Glowing emerald checkmark badge with particle/confetti effect.
   - Booking reference `#GH250415007`, collection PIN, and quick navigation.
6. **My Bookings**
   - Tabs: Upcoming, Past, Cancelled.
   - Equipment cards with reference numbers, status badges (Confirmed, Paid), and details modal.

### Admin Dashboard (Sidebar Navigation)
7. **Admin Dashboard (Page 1)**
   - Top stats cards: Total Bookings (248), Total Revenue (₹12,400), Pending Payments (6), Available Equipment (7).
   - Booking Overview: Glowing emerald SVG curve chart over Mon-Sun.
   - Recent Bookings list (`#GH250415007`, `#GH250415006`, `#GH250415005`).
8. **Equipment Management (Page 2)**
   - Inventory table: Asset code, name, status (Available, Maintenance), hourly rate, edit and delete actions.
   - "+ Add Equipment" modal for adding new laptops, controllers, and combos.
9. **Payment Verification (Page 3)**
   - Review tabs: Pending, Verified, Rejected.
   - UPI transaction cards with UTR numbers, amounts, and receipt screenshots (click to view modal).
   - One-click "Mark Paid" (updates customer bookings) and "Reject" buttons.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```
