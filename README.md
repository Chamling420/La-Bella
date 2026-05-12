# La Bella - Beauty Salon Website

A full-featured beauty salon web application built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### Authentication & Roles
- Three user roles: User, Admin, Super Admin
- Login and registration system
- Default accounts:
  - Super Admin: `super@labella.com` / `super123`
  - Admin: `admin@labella.com` / `admin123`
  - User: `user@labella.com` / `user123`

### Home Page
- Hero section with dynamic content (editable by Admin/Super Admin)
- Why Choose Us section with editable statistics
- Popular services showcase
- Call-to-action section
- All home page text is editable from admin panels

### Services
- Browse available beauty services with pricing and duration
- Book appointments with calendar date picker
- Appointment status tracking (pending, confirmed, cancelled)
- Admin/Super Admin can confirm or cancel appointments

### Products & Shopping
- Product catalog with search, filter, and sort
- Add to cart with quantity management
- Product images support both URL input and direct device upload (drag & drop or file picker)
- Supported image formats: JPEG, PNG, GIF, WebP, SVG (max 5MB)

### Checkout System
- Two payment options: **Pay Now** (online) and **Cash on Delivery**
- Cash on Delivery: instant order confirmation with success message
- Online Payment: select from Bank, eSewa, Khalti, or IME Pay
- Payment verification form: Full Name, Transaction Number, Payment Slip/Screenshot upload
- Order tracking with status management

### Message Us
- Floating "Message Us" button (bottom-right, always visible for users)
- Real-time chat dialog with message history
- Date separators and admin reply indicators
- Unread reply badge notification

### Admin Panel (7 tabs)
- **Services**: Add, edit, delete services
- **Products**: Add, edit, delete products with image upload
- **Appointments**: View, confirm, cancel appointments
- **Users**: View registered users
- **Messages**: View user messages, reply, delete
- **Orders**: View all orders, see payment details, confirm/cancel orders, view payment slips
- **Settings**: Edit home page content, home button text, social media links

### Super Admin Panel (8 tabs)
- All Admin panel features plus:
- **Users**: Full user management, role changes, delete users
- **Payment Methods**: Add, edit, delete payment methods (Bank, eSewa, Khalti, IME Pay) with QR image upload
- Bank fields: Account Holder Name, Account Number, Branch Name, QR Code
- Wallet fields: Wallet Name, Wallet Number, QR Code

### Footer
- Social media icons: Instagram, Facebook, Twitter, TikTok, YouTube, WhatsApp
- All social media links editable from Admin/Super Admin Settings tab
- Icons without links are dimmed and non-interactive

### Unsaved Changes Warning
- Popup warning when navigating away from unsaved work
- Save and Discard options
- Browser close/refresh protection when changes are pending

### Gallery
- Image gallery with fullscreen view
- Admin can add and delete images

### Reviews
- Star rating system (1-5 stars)
- Submit and view reviews
- Admin can delete inappropriate reviews

### Dark/Light Mode
- Theme toggle in navbar
- Persists across sessions

### Currency
- All prices displayed in NPR (Nepalese Rupees)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: Zustand with localStorage persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Push database schema
bun run db:push
```

## Project Structure

```
src/
  app/
    page.tsx              # Main page with client-side routing
    layout.tsx            # Root layout with providers
    globals.css           # Global styles and theme
    api/
      upload/route.ts     # Image upload API
  components/
    Navbar.tsx            # Navigation bar
    Footer.tsx            # Footer with social links
    MessageUs.tsx         # Floating chat button & dialog
    ThemeProvider.tsx      # Dark/light theme provider
    pages/
      HomePage.tsx
      ServicesPage.tsx
      ProductsPage.tsx
      CartPage.tsx
      AppointmentsPage.tsx
      GalleryPage.tsx
      ReviewsPage.tsx
      AdminPanel.tsx
      SuperAdminPanel.tsx
      ProfilePage.tsx
      AuthPages.tsx
    ui/                   # shadcn/ui components
  lib/
    store.ts              # Zustand store with all state & actions
    utils.ts              # Utility functions
```

## Changes Log

- Replaced `$` currency symbol with `NPR`
- Added editable Home button text in navbar
- Added appointment confirmation system (pending/confirmed/cancelled)
- Implemented real-time reactivity with auto-save pattern (changes save instantly on every keystroke)
- Added direct image upload from device for product images (drag & drop + file picker)
- Added "Message Us" floating chat button for users
- Added Messages section in Admin/Super Admin panels (view, reply, delete)
- Added Orders section in Admin/Super Admin panels (view, confirm, cancel, payment details)
- Added checkout flow with Pay Now / Cash on Delivery options
- Added online payment with Bank, eSewa, Khalti, IME Pay support
- Added payment verification form (Full Name, Transaction Number, Payment Slip upload)
- Added Payment Methods management (Super Admin only) with type-specific fields and QR upload
- Added TikTok, YouTube, WhatsApp icons to footer
- Made all social media links editable from Admin/Super Admin panels
- Added unsaved changes warning popup with Save/Discard options
