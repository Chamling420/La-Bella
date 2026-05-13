# La Bella - Beauty Salon Web Application

A full-featured, production-ready beauty salon web application built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

---

## Overview

La Bella is a comprehensive beauty salon management system with three distinct user roles (Super Admin, Admin, User), a complete e-commerce flow with multiple payment options, appointment booking, real-time messaging, and a fully customizable home page.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript 5** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **shadcn/ui** | UI component library (New York style) |
| **Zustand** | State management with localStorage persistence |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |
| **next-themes** | Dark/light mode |

---

## Features

### Authentication & User Management
- **3 User Roles**: Super Admin, Admin, and User
- **Login/Register** with email and password
- **Profile page** with user stats and change password
- **Role-based access control** for admin panels
- Default accounts:
  - Super Admin: `super@labella.com` / `super123`
  - Admin: `admin@labella.com` / `admin123`
  - User: `user@labella.com` / `user123`

### Home Page (Fully Customizable)
- Hero section with badge, title, subtitle, and CTA buttons
- "Why Choose Us" section with brand highlight
- Statistics section (3 editable stats)
- Popular services showcase
- CTA (Call to Action) section
- All text content is **editable by Admin/Super Admin** from the Settings tab

### Services
- Browse all beauty services with prices and durations
- **Book appointments** directly from the services page with calendar date picker
- Admin can **add, edit, delete** services with icon selection

### Products & E-Commerce
- Browse products with search, category filter, and sort options
- **Add to cart** with quantity controls
- **Cart page** with full checkout flow:
  - **Cash on Delivery**: Instant order placement
  - **Online Payment**: Select from active payment methods (Bank Transfer, eSewa, Khalti, IME Pay)
  - **Payment verification form**: Full name, transaction number, payment slip upload
  - **Order success** screen with animated checkmark

### Orders Management (Admin)
- View all orders in desktop table or mobile card layout
- See payment method, status, and payment verification details
- **View payment slips** (screenshots) for online payments
- **Confirm** or **Cancel** orders with confirmation dialogs
- Pending order count badge on tab

### Payment Methods (Super Admin Only)
- Full CRUD for payment methods: **Bank Transfer, eSewa, Khalti, IME Pay**
- Bank methods: Account holder name, account number, branch name
- Wallet methods: Wallet name, wallet number
- **QR code image upload** for each payment method
- **Active/Inactive toggle** for each method
- Only active methods are shown to users during checkout

### Appointments
- Book appointments from the services page
- View all appointments with status (Pending, Confirmed, Cancelled)
- Cancel appointments (users)
- Confirm/Cancel appointments (admin/super admin)

### Gallery
- Image grid with fullscreen view
- Admin can **add** gallery images (via URL or device upload)
- Admin can **delete** gallery images

### Reviews
- Star rating system (1-5 stars)
- Write and submit reviews
- Admin can **delete** reviews

### Messaging System ("Message Us")
- Floating chat button (bottom-right corner) for logged-in users
- Full chat dialog with message bubbles
- **Date separators** (Today, Yesterday, or date)
- **Unread reply indicator** with badge
- Admin can **view, read, reply, delete** messages from admin panel
- Auto-scroll to newest messages

### Admin Panel (Admin Role)
- **7 tabs**: Services, Products, Appointments, Users, Messages, Orders, Settings
- Full CRUD for services and products
- View and manage appointments (confirm/cancel)
- View user list
- Messages tab with read/unread tracking, expand/collapse, reply
- Orders tab with payment verification and status management
- Settings tab:
  - Home page content editing (auto-save)
  - Social media links editing (auto-save)
- **Unsaved changes warning** when switching tabs

### Super Admin Panel (Super Admin Role)
- **8 tabs**: Users, Services, Products, Appointments, Messages, Orders, Payment Methods, Settings
- Everything from Admin Panel, PLUS:
- **User management**: Change roles, delete users
- **Payment Methods** tab: Full CRUD with QR upload
- Full control over all site settings

### Footer
- Brand name and description (editable)
- Contact info: Address, phone, email (all editable)
- Opening hours (editable)
- Quick links (editable)
- **6 social media icons**: Instagram, Facebook, Twitter, TikTok, YouTube, WhatsApp
- All social links are **editable** from Settings tab
- Icons without links are dimmed and non-interactive

### Dark/Light Mode
- Toggle between dark and light themes
- Powered by next-themes

### Responsive Design
- Mobile-first approach
- Fully responsive on all screen sizes
- Separate desktop table and mobile card views in admin panels
- Touch-friendly UI with proper spacing

### Image Upload
- **Dual-mode upload**: Upload from device OR enter URL
- Drag & drop support
- File validation (type + size)
- Image preview with hover controls
- Used for product images, payment method QR codes, and payment slip uploads

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # Image upload API endpoint
│   ├── globals.css               # Global styles with beauty salon theme
│   ├── layout.tsx                # Root layout with theme provider
│   └── page.tsx                  # Main page with client-side routing
├── components/
│   ├── pages/
│   │   ├── HomePage.tsx          # Home page (all content from store)
│   │   ├── ServicesPage.tsx      # Services listing + booking modal
│   │   ├── ProductsPage.tsx      # Products with search/filter/sort
│   │   ├── CartPage.tsx          # Cart + multi-step checkout flow
│   │   ├── AppointmentsPage.tsx  # Appointment management
│   │   ├── GalleryPage.tsx       # Image gallery with fullscreen view
│   │   ├── ReviewsPage.tsx       # Reviews with star rating
│   │   ├── AdminPanel.tsx        # Admin panel (7 tabs)
│   │   ├── SuperAdminPanel.tsx   # Super Admin panel (8 tabs)
│   │   ├── ProfilePage.tsx       # User profile + change password
│   │   └── AuthPages.tsx         # Login & Register forms
│   ├── ui/                       # shadcn/ui components
│   │   └── image-upload.tsx      # Reusable image upload component
│   ├── Navbar.tsx                # Navigation bar with cart badge
│   ├── Footer.tsx                # Footer with social links
│   ├── MessageUs.tsx             # Floating chat button + dialog
│   └── ThemeProvider.tsx         # Dark/light mode provider
├── lib/
│   ├── store.ts                  # Zustand store (all state + actions)
│   └── utils.ts                  # Utility functions
└── hooks/
    ├── use-toast.ts              # Toast hook
    └── use-mobile.ts             # Mobile detection hook
```

---

## Data Persistence

All data is persisted in the browser's **localStorage** via Zustand's manual hydration pattern. This includes:

- Users, Services, Products, Cart, Appointments
- Gallery images, Reviews, Messages, Orders
- Payment methods, Home page content, Site settings

Data loads from localStorage on app startup (hydration) and saves on every mutation.

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Chamling420/La-Bella.git
cd La-Bella

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:3000`.

### Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | super@labella.com | super123 |
| Admin | admin@labella.com | admin123 |
| User | user@labella.com | user123 |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload image file (multipart/form-data) |

### Upload API Details

- **Accepts**: multipart/form-data with `file` field
- **Allowed types**: JPEG, PNG, GIF, WebP, SVG, HEIC, BMP, AVIF
- **Max size**: 10MB
- **Returns**: `{ url: "/uploads/filename.jpg" }`
- **Files stored in**: `public/uploads/`

---

## Key Design Decisions

1. **Client-side routing** via Zustand state (no React Router) — keeps the app as a single-page application
2. **localStorage persistence** — no database required, instant setup
3. **Auto-save pattern** in Settings — no "Save" button needed, changes are saved on every keystroke
4. **Unsaved changes warning** — prevents accidental data loss when switching tabs with unsaved form data
5. **BeforeUnload listener** — warns before browser close/refresh when unsaved changes exist
6. **Image upload dual mode** — supports both device upload and URL input for maximum flexibility
7. **NPR currency** — all prices displayed in Nepalese Rupees (NPR)

---

## Recent Changes & Additions

### What was added/changed in this build:

1. **Complete La Bella Beauty Salon website** built from scratch with Next.js 16
2. **3-role authentication system** (Super Admin, Admin, User)
3. **Home page content editing** — all text is editable by Admin/Super Admin from Settings tab
4. **Real-time reactivity** — store changes trigger immediate UI updates using proper Zustand selectors
5. **Image upload from device** — dual-mode upload (device or URL) for product images
6. **6 social media icons in Footer** — Instagram, Facebook, Twitter, TikTok, YouTube, WhatsApp, all editable
7. **"Message Us" floating chat** — real-time messaging between users and admins
8. **Complete checkout flow** — Cash on Delivery + Online Payment with verification
9. **Orders tab in Admin/Super Admin** — view, confirm, cancel orders with payment slip viewing
10. **Messages tab in Admin/Super Admin** — read, reply, delete messages with unread tracking
11. **Payment Methods tab (Super Admin)** — full CRUD for Bank, eSewa, Khalti, IME Pay with QR upload
12. **Social Media Links editing** — in Settings tab for both Admin and Super Admin
13. **Unsaved changes warning** — protects against accidental navigation with unsaved form data
14. **Dark/light mode toggle** — with next-themes
15. **Responsive design** — mobile-first with separate desktop/mobile layouts in admin

---

## License

This project is proprietary and owned by La Bella Beauty Salon.
