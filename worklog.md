---
Task ID: 1-16
Agent: Main Developer
Task: Build complete La Bella Beauty Salon website with all features

Work Log:
- Explored project structure and existing setup (Next.js 16, shadcn/ui, zustand, etc.)
- Created Zustand store (src/lib/store.ts) with all data models, localStorage persistence, and actions
- Created ThemeProvider (src/components/ThemeProvider.tsx) for dark/light mode
- Updated layout.tsx with Inter font and theme provider
- Updated globals.css with beauty salon theme (rose/pink accent colors)
- Created Navbar (src/components/Navbar.tsx) with responsive hamburger menu, cart badge, user dropdown, theme toggle
- Created Footer (src/components/Footer.tsx) with contact info, social links, opening hours
- Created HomePage (src/components/pages/HomePage.tsx) with hero, highlights, popular services, CTA
- Created ServicesPage (src/components/pages/ServicesPage.tsx) with service cards and booking modal with calendar
- Created ProductsPage (src/components/pages/ProductsPage.tsx) with search, filter, sort, add-to-cart
- Created CartPage (src/components/pages/CartPage.tsx) with quantity controls, order summary, checkout
- Created AppointmentsPage (src/components/pages/AppointmentsPage.tsx) with tabs, cancel confirmation
- Created GalleryPage (src/components/pages/GalleryPage.tsx) with image grid, fullscreen view, admin add/delete
- Created ReviewsPage (src/components/pages/ReviewsPage.tsx) with star rating, review submission, admin delete
- Created AdminPanel (src/components/pages/AdminPanel.tsx) with CRUD for services/products, view appointments/users
- Created SuperAdminPanel (src/components/pages/SuperAdminPanel.tsx) with user management, role changes, full CRUD
- Created ProfilePage (src/components/pages/ProfilePage.tsx) with user info, stats, change password
- Created AuthPages (src/components/pages/AuthPages.tsx) with Login and Register forms
- Created main page.tsx that routes between all pages using Zustand state
- Fixed default vs named export issues
- Added unoptimized prop for external images in CartPage
- Configured next.config.ts for Unsplash remote images
- All lint checks pass clean

Stage Summary:
- Complete La Bella Beauty Salon website built with Next.js 16
- Features: 3-role auth, dark/light mode, services booking, product e-commerce with cart, appointment management, gallery, reviews, admin panel, super admin panel, user profile
- All data persisted in localStorage via Zustand store
- Responsive design with glassmorphism, framer-motion animations, toast notifications
- Default accounts: super@labella.com/super123, admin@labella.com/admin123, user@labella.com/user123

---
Task ID: 2
Agent: Main Developer
Task: Make Home page content editable by Admin and Super Admin from admin panel

Work Log:
- Added HomePageContent interface to store.ts with all editable fields (hero section, why choose section, statistics, popular services section, CTA section)
- Added DEFAULT_HOME_PAGE_CONTENT constant with all default values matching current hardcoded text
- Added homePageContent state and setHomePageContent action to Zustand store with localStorage persistence
- Updated hydration logic to load homePageContent from localStorage
- Updated HomePage.tsx to read all text content from store instead of hardcoded values
- Added Home Page Content editing card to AdminPanel.tsx Settings tab with all fields organized by section
- Added Home Page Content editing card to SuperAdminPanel.tsx Settings tab with same fields
- Added Reset to Defaults button to both admin panels for easy restoration of default content
- Added Sparkles icon import to SuperAdminPanel for Home Page Content card header
- Added local editing state (editingHomePage) with useEffect sync for both admin panels
- Changed save toast message to indicate navigating to Home page to see changes

Stage Summary:
- All Home page text is now editable by Admin and Super Admin from Settings tab in their respective panels
- Editable content includes: hero badge, title, subtitle, description, button texts, why choose section, all 3 statistics (value/label/description), popular services section, and CTA section
- Content changes are persisted in localStorage and take effect immediately upon navigating to Home page
- Reset to Defaults button allows quick restoration of original content
- Zustand store reactivity ensures components always show the latest content

---
Task ID: 3
Agent: Main Developer
Task: Fix real-time reactivity issue - make store changes trigger UI re-renders immediately

Work Log:
- Changed HomePage.tsx from destructuring entire store to using proper Zustand selectors (s.services, s.setCurrentPage, s.homePageContent)
- Changed Navbar.tsx from destructuring entire store to using individual Zustand selectors for each value
- Changed AdminPanel.tsx Settings tab from "draft + Save" pattern to auto-save pattern:
  - Removed editingHomePage local state and useEffect sync
  - Removed homeTextEditing local state and useEffect sync
  - All input fields now directly call setHomePageContent({ field: value }) on every keystroke
  - Home button text input now directly calls setHomeButtonText(value) on every keystroke
  - Removed "Save All Changes" button (no longer needed with auto-save)
  - Kept "Reset to Defaults" button that calls setHomePageContent(defaults) directly
  - Added "Changes are saved automatically" help text
- Changed SuperAdminPanel.tsx SettingsTab from "draft + Save" pattern to auto-save pattern:
  - Same changes as AdminPanel
  - All inputs auto-save to store on every keystroke
  - Removed "Save All Changes" button
  - Kept "Reset to Defaults" button

Stage Summary:
- Real-time reactivity is now fully working
- Every keystroke in admin panel immediately updates the Zustand store
- Navbar's home button text updates in real-time as admin types
- Home page content updates instantly when user navigates to Home page
- No more "navigate to Home to see changes" - changes are live immediately
- Proper Zustand selectors ensure optimal re-render behavior

---
Task ID: 4
Agent: Main Developer
Task: Add direct image upload from device to product section (both Admin and Super Admin panels)

Work Log:
- Created API route for image uploads at src/app/api/upload/route.ts
  - Accepts multipart/form-data file uploads
  - Validates file type (JPEG, PNG, GIF, WebP, SVG) and size (max 5MB)
  - Saves files to public/uploads/ directory with unique filenames
  - Returns the public URL path (/uploads/filename)
- Created reusable ImageUpload component at src/components/ui/image-upload.tsx
  - Two modes: "Upload from Device" and "Enter URL" with toggle buttons
  - Upload mode: drag & drop zone with "Select Your Image" button, click to browse
  - File validation on client side (type + size) before uploading
  - Loading spinner during upload
  - Image preview with hover controls (re-upload / delete)
  - URL mode: text input with live image preview
  - Auto-detects mode based on existing value (http URLs → URL mode, else upload mode)
- Updated AdminPanel.tsx (line ~1709)
  - Replaced "Image URL" Label+Input with ImageUpload component
  - Added import for ImageUpload component
  - Widened product dialog from sm:max-w-md to sm:max-w-lg for better upload area
- Updated SuperAdminPanel.tsx (line ~922)
  - Replaced "Image URL" Label+Input with ImageUpload component
  - Added import for ImageUpload component
- Created public/uploads/ directory for storing uploaded images
- Lint passes clean, dev server compiles without errors

Stage Summary:
- Product image upload now supports two methods:
  1. Direct upload from device (gallery/file picker) via "Select Your Image" button or drag & drop
  2. Paste image URL (external links) via "Enter URL" mode
- Both Admin Panel and Super Admin Panel product dialogs now use the new ImageUpload component
- Uploaded images are stored in public/uploads/ and referenced by /uploads/filename URL
- File validation: JPEG/PNG/GIF/WebP/SVG only, max 5MB
- User-friendly UX with preview, hover controls, and toast notifications

---
Task ID: 5
Agent: Footer Developer
Task: Update Footer component to add TikTok, YouTube, WhatsApp icons and make all social links use editable store values

Work Log:
- Read existing Footer.tsx - had 3 social icons (Instagram, Facebook, Twitter) all hardcoded with href="#"
- Added Youtube icon import from lucide-react
- Created custom inline SVGs for TikTok and WhatsApp icons (lucide-react doesn't have these)
- Built a socialLinks array mapping all 6 social platforms to their store values from homePageContent
- Each social link reads from the corresponding store field (footerInstagramLink, footerFacebookLink, footerTwitterLink, footerTiktokLink, footerYoutubeLink, footerWhatsappLink)
- If the link is empty/missing, icon still renders but as a <span> with reduced opacity and no navigation
- If the link exists, renders as an <a> with target="_blank" and rel="noopener noreferrer"
- All 6 icons displayed in a flex row with flex-wrap and gap-3
- All icons have proper aria-labels for accessibility
- Same styling preserved: h-9 w-9 rounded-full bg-primary/10 with hover:bg-primary hover:text-primary-foreground transition
- Lint passes clean

Stage Summary:
- Footer now shows 6 social media icons: Instagram, Facebook, Twitter, TikTok, YouTube, WhatsApp
- All social links are driven by editable store values from homePageContent
- Icons without links render as non-interactive (dimmed, cursor-default)
- Icons with links open in new tab with proper security attributes
- Custom SVGs used for TikTok and WhatsApp for accurate brand representation

---
Task ID: 6
Agent: MessageUs Developer
Task: Create "Message Us" floating button + chat dialog component for users

Work Log:
- Created /home/z/my-project/src/components/MessageUs.tsx with full chat functionality
- Floating button features:
  - Fixed position at bottom-right corner (bottom-6 right-6), z-50
  - Round 56px button with primary color, shadow-lg
  - MessageCircle icon from lucide-react
  - Subtle pulse animation (animate-ping ring behind the button)
  - Unread reply indicator badge with destructive color and ping animation
  - Only visible for logged-in users with 'user' role (hidden for admin/superadmin and on admin/superadmin pages)
  - Smooth spring entrance/exit animation via framer-motion AnimatePresence
- Chat panel features:
  - Slides up from bottom-right with spring animation
  - 350px wide on desktop (sm:), full width minus padding on mobile
  - 500px height on desktop, 70vh on mobile
  - Rounded-2xl with border and shadow-2xl
  - Header with primary bg, MessageSquare icon, title "Message Us", subtitle, close button
  - Messages area using ScrollArea with auto-scroll to bottom
  - User messages right-aligned with primary bg, rounded chat bubbles (rounded-br-md)
  - Admin replies left-aligned with muted bg, rounded chat bubbles (rounded-bl-md)
  - Admin name shown above reply text in primary color
  - Timestamps shown below each message
  - Date separators (Today, Yesterday, or date) shown between different-day messages
  - Empty state with icon, "No messages yet" text, and invitation to start conversation
  - Input area at bottom with rounded-full Input and Send button
  - Enter key sends message, button disabled when input is empty
  - Auto-focus on input when chat opens
- Data integration:
  - Uses useAppStore selectors for currentUser, currentPage, messages, addMessage
  - chatItems computed via useMemo - flattens user messages + admin replies into single list
  - Date separators pre-computed by comparing adjacent items (avoids lint error with variable reassignment)
  - hasUnreadReply detection for badge indicator
- Integrated into page.tsx by importing and rendering <MessageUs /> after <Footer />
- All lint checks pass clean
- Dev server compiles without errors

Stage Summary:
- "Message Us" floating chat button with full chat dialog created
- Only visible to regular users (not admin/superadmin, not on admin pages)
- Chat shows conversation thread with user messages and admin replies
- Responsive design: 350px panel on desktop, full-width on mobile
- Smooth framer-motion animations for button and panel
- Pulse animation on floating button, unread reply badge
- Auto-scroll, auto-focus input, date separators
- Uses store's addMessage action and messages filtered by current user ID

---
Task ID: 5
Agent: Checkout Developer
Task: Update CartPage with complete checkout flow including Pay Now / Cash on Delivery options, payment verification, and order submission

Work Log:
- Read existing CartPage.tsx - had a simple handleCheckout that just showed a toast and cleared cart
- Read store.ts to understand Order, OrderItem, PaymentMethod types and addOrder/getActivePaymentMethods actions
- Read ImageUpload component interface (value/onChange/label props)
- Read Dialog component from shadcn/ui for API
- Completely rewrote CartPage.tsx with multi-step checkout dialog flow:
  - Added checkout step state machine: "closed" → "method" → "online" → "verify" → "success"
  - Step 1 (method): Two payment option cards - Cash on Delivery (Truck icon) and Pay Now (CreditCard icon)
  - Step 2a (COD): Immediate order creation with cash_on_delivery payment method, success message "Your order has been placed. You will pay when your order is delivered."
  - Step 2b (online): Displays active payment methods from store as selectable cards, each showing:
    - Method-specific icon and label (Bank/eSewa/Khalti/IME Pay)
    - Bank: Account Holder Name, Account Number, Branch Name
    - Wallet: Wallet Name, Wallet Number
    - QR image if available with "Scan to pay" hint
    - Empty state with "No Payment Methods Available" if none active
  - Step 3 (verify): Payment verification form with:
    - Selected payment method summary card with total amount
    - Payment details card (transfer instructions with account/wallet details and QR)
    - Full Name input (required)
    - Transaction Number input (required)
    - Payment Slip/Screenshot upload via ImageUpload component (optional)
    - Submit Order button with loading state
  - Success step: Animated checkmark, success message, "Continue Shopping" and "Close" buttons
- Used proper Zustand selectors instead of destructuring entire store
- Used Dialog from shadcn/ui with sm:max-w-2xl for adequate width
- Used AnimatePresence for smooth step transitions within the dialog
- Used Label and Input from shadcn/ui for form fields
- Added back navigation buttons at each step (ArrowLeft icons)
- Added login check before opening checkout dialog
- Tax calculation (8%) preserved from original
- Order items built from cart + products using buildOrderItems()
- All lint checks pass clean
- Dev server compiles without errors

Stage Summary:
- CartPage now has a complete multi-step checkout flow in a dialog
- Cash on Delivery: instant order creation, no verification needed
- Online Payment: select payment method → fill verification form → submit order
- Payment methods pulled from store (active only), with full details displayed
- Payment slip upload supported via ImageUpload component
- Smooth framer-motion animations between steps
- Proper form validation (full name and transaction number required)
- Success screen with animated checkmark and clear messaging

---
Task ID: 6
Agent: AdminPanel Developer
Task: Update AdminPanel to add Messages tab, Orders tab, and Social Media editing in Settings tab, plus an unsaved changes warning popup

Work Log:
- Read existing AdminPanel.tsx (1790 lines) to understand full structure
- Read store.ts to understand Message, Order, OrderItem, PaymentMethod types and all related actions
- Read worklog.md to understand project history and previous changes
- Completely rewrote AdminPanel.tsx with the following additions:

1. Messages Tab (new, before Settings):
  - Added MessageSquare icon in TabsList with unread count badge (destructive color)
  - Messages sorted newest first with max-h-600px scrollable container
  - Each message shows: avatar with initials, user name, email, message preview, timestamp
  - Unread messages highlighted with primary border + background
  - Click to expand/collapse (ChevronDown/ChevronUp icons)
  - Expanded view shows: full message text, replies list (admin name + timestamp), reply input with Send button
  - markMessageRead called automatically when expanding an unread message
  - Delete button with AlertDialog confirmation per message
  - Reply input with Enter key to send, Send button disabled when empty
  - Empty state with Mail icon
  - Reply text tracked in replyTexts Record<string, string> state

2. Orders Tab (new, before Settings):
  - Added Package icon in TabsList with pending count badge (amber color)
  - Orders sorted by createdAt newest first
  - Desktop table view: Order ID (last 6 chars), Customer (name + email), Items list, Total (NPR), Payment method badge, Status badge, Date, Actions
  - Mobile card view: same info in card layout with payment verification inline for online payments
  - Payment method label helper: cash_on_delivery → "Cash on Delivery", bank → "Bank Transfer", esewa → "eSewa", khalti → "Khalti", imepay → "IME Pay"
  - Truck icon for COD, CreditCard icon for online payments
  - Status badges: pending (amber), confirmed (green/emerald), cancelled (red) with Clock/CheckCircle2/XCircle icons
  - Eye button to view payment verification details (opens Dialog with Full Name, Transaction Number, Payment Slip)
  - Payment slip thumbnail clickable to view full size in separate Dialog
  - Confirm button (emerald) for pending orders with AlertDialog
  - Cancel button (red) for pending/confirmed orders with AlertDialog
  - Empty state with Package icon

3. Social Media Links in Settings Tab:
  - New Card section "Social Media Links" with MessageSquare icon
  - Six editable fields: Instagram, Facebook, Twitter, TikTok, YouTube, WhatsApp
  - All use auto-save pattern via setHomePageContent({ field: value }) on every keystroke
  - Help text: "Changes are saved automatically. Leave a field empty to hide the icon in the footer."

4. Unsaved Changes Warning:
  - Converted Tabs from uncontrolled (defaultValue) to controlled (value + onValueChange)
  - activeTab state tracks current tab
  - hasUnsavedChanges computed from: serviceDialogOpen || productDialogOpen || any reply text has content
  - handleTabChange checks hasUnsavedChanges; if true, sets pendingTab and opens AlertDialog
  - AlertDialog with AlertTriangle icon, "Unsaved Changes" title
  - "Discard Changes" button (AlertDialogCancel) with X icon: closes dialogs, clears forms, clears reply texts, proceeds to pending tab
  - "Save Changes" button (AlertDialogAction) with Save icon: saves valid service/product forms, sends pending replies, proceeds to pending tab
  - useBeforeUnload effect added for browser close/refresh protection when hasUnsavedChanges is true
  - Uses Save and X icons from lucide-react as specified

5. Store Selectors:
  - Converted from destructuring entire store to individual Zustand selectors (s => s.xxx)
  - Added new selectors: messages, replyToMessage, markMessageRead, deleteMessage, orders, confirmOrder, cancelOrder
  - Imported Order type from store for payment details dialog

6. New Helper Functions:
  - formatDateTime: formats ISO timestamp to "Mon DD, YYYY, HH:MM AM/PM"
  - getPaymentMethodLabel: maps payment method keys to display labels
  - getOrderStatusBadge: returns badge class names for order statuses

7. New Dialogs:
  - Payment Details Dialog: shows Full Name, Transaction Number, Payment Slip for online payment orders
  - Payment Slip Viewer Dialog: full-size image viewer for payment slip screenshots
  - Unsaved Changes AlertDialog: confirmation popup with Save/Discard options

- All lint checks pass clean
- Dev server compiles without errors

Stage Summary:
- AdminPanel now has 7 tabs: Services, Products, Appointments, Users, Messages, Orders, Settings
- Messages tab provides full message management with read/unread tracking, expandable view, and reply functionality
- Orders tab shows all orders with payment verification details, status management, and payment slip viewing
- Settings tab includes Social Media Links editing (6 platforms, auto-save)
- Unsaved changes warning protects against accidental navigation when dialogs are open or reply text is pending
- Proper Zustand selectors used throughout for optimal re-render behavior
- Browser beforeunload listener added for external navigation protection

---
Task ID: 7
Agent: SuperAdminPanel Developer
Task: Update SuperAdminPanel to add Messages tab, Orders tab, Payment Methods tab, and Social Media editing in Settings tab, plus unsaved changes warning

Work Log:
- Read existing SuperAdminPanel.tsx to understand full structure (users, services, products, appointments, settings tabs)
- Read store.ts to understand Message, Order, OrderItem, PaymentMethod, PaymentMethodType types and all related actions
- Read worklog.md to understand project history and previous changes
- Read AdminPanel.tsx to reference patterns for Messages, Orders, and Social Media implementations
- Completely rewrote SuperAdminPanel.tsx with the following additions:

1. Messages Tab (new, before Settings):
  - Added MessageSquare icon in TabsList with unread count badge (destructive color)
  - Messages sorted newest first with max-h-600px scrollable container
  - Each message shows: avatar with initials, user name, email, message preview, timestamp
  - Unread messages highlighted with primary border + background
  - Click to expand/collapse (ChevronDown/ChevronUp icons)
  - Expanded view shows: full message text, replies list (admin name + timestamp), reply input with Send button
  - markMessageRead called automatically when expanding an unread message
  - Delete button with AlertDialog confirmation per message (SuperAdmin CAN delete, unlike Admin)
  - Reply input with Enter key to send, Send button disabled when empty
  - Empty state with Mail icon
  - Reply text tracked in replyTexts Record<string, string> state

2. Orders Tab (new, before Settings):
  - Added Package icon in TabsList with pending count badge (amber color)
  - Orders sorted by createdAt newest first
  - Desktop table view: Order ID (last 6 chars), Customer (name + email), Items list, Total (NPR), Payment method badge, Status badge, Date, Actions
  - Mobile card view: same info in card layout with payment verification inline for online payments
  - Payment method label helper: cash_on_delivery → "Cash on Delivery", bank → "Bank Transfer", esewa → "eSewa", khalti → "Khalti", imepay → "IME Pay"
  - Truck icon for COD, CreditCard icon for online payments
  - Status badges: pending (amber), confirmed (green/emerald), cancelled (red) with Clock/CheckCircle2/XCircle icons
  - Eye button to view payment verification details (opens Dialog with Full Name, Transaction Number, Payment Slip)
  - Payment slip thumbnail clickable to view full size in separate Dialog
  - Confirm button (emerald) for pending orders with AlertDialog
  - Cancel button (red) for pending/confirmed orders with AlertDialog
  - Empty state with Package icon

3. Payment Methods Tab (new, SUPER ADMIN ONLY):
  - Added CreditCard icon in TabsList
  - Payment methods displayed as cards in a 2-column grid
  - Each card shows: type icon (Building2/Smartphone/Wallet), name/number, active status toggle (Switch)
  - Bank cards show: Account Holder Name, Account Number, Branch Name
  - Wallet cards show: Wallet Name, Wallet Number
  - QR image displayed on cards if available
  - Add/Edit Payment Method dialog:
    - Type selector (Bank Transfer, eSewa, Khalti, IME Pay) with icons
    - Conditional fields based on type:
      - Bank: Account Holder Name, Account Number, Branch Name, QR Image upload
      - eSewa: eSewa Name, eSewa Number, QR Image upload
      - Khalti: Khalti Name, Khalti Number, QR Image upload
      - IME Pay: IME Pay Name, IME Pay Number, QR Image upload
    - Active toggle (Switch) with description
    - Uses ImageUpload component for QR image uploads
  - Delete payment method with AlertDialog confirmation
  - Uses addPaymentMethod, updatePaymentMethod, deletePaymentMethod actions
  - Empty state with CreditCard icon

4. Social Media Links in Settings Tab:
  - New Card section "Social Media Links" with MessageSquare icon
  - Six editable fields: Instagram, Facebook, Twitter, TikTok, YouTube, WhatsApp
  - All use auto-save pattern via setHomePageContent({ field: value }) on every keystroke
  - Help text: "Changes are saved automatically. Leave a field empty to hide the icon in the footer."

5. Unsaved Changes Warning:
  - Converted Tabs from uncontrolled (defaultValue) to controlled (value + onValueChange)
  - activeTab state tracks current tab
  - hasUnsavedChanges computed from: serviceDialogOpen || productDialogOpen || any reply text has content
  - handleTabChange checks hasUnsavedChanges; if true, sets pendingTab and opens AlertDialog
  - AlertDialog with AlertTriangle icon, "Unsaved Changes" title
  - "Discard Changes" button (AlertDialogCancel) with X icon: closes dialogs, clears forms, clears reply texts, proceeds to pending tab
  - "Save Changes" button (AlertDialogAction) with Save icon: sends pending replies, closes dialogs, proceeds to pending tab
  - useBeforeUnload effect added for browser close/refresh protection when hasUnsavedChanges is true

6. Store Selectors:
  - Converted from destructuring entire store to individual Zustand selectors (s => s.xxx)
  - Added new selectors: messages, replyToMessage, markMessageRead, deleteMessage, orders, confirmOrder, cancelOrder, paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod

7. New Helper Functions:
  - formatDateTime: formats ISO timestamp to "Mon DD, YYYY, HH:MM AM/PM"
  - getPaymentMethodLabel: maps payment method keys to display labels
  - getOrderStatusBadge: returns badge class names for order statuses
  - getPaymentMethodIcon: returns icon component for payment method type
  - getPaymentMethodTypeName: returns display name for payment method type

8. New Imports:
  - Added AlertDialogTrigger for inline delete confirmations in Orders tab
  - Added Switch component from shadcn/ui for active toggles in Payment Methods
  - Added new lucide-react icons: MessageSquare, Package, Send, Mail, ChevronDown, ChevronUp, Eye, CreditCard, Save, X, Truck, Building2, Smartphone, Wallet
  - Added type imports: Order, PaymentMethod, PaymentMethodType

9. Service/Product Dialog State Hoisting:
  - Moved serviceDialogOpen/productDialogOpen state to parent component for unsaved changes tracking
  - Passed dialog state as props to ManageServicesTab and ManageProductsTab

- All lint checks pass clean
- Dev server compiles without errors

Stage Summary:
- SuperAdminPanel now has 8 tabs: Users, Services, Products, Appointments, Messages, Orders, Payment Methods, Settings
- Messages tab provides full message management with read/unread tracking, expandable view, reply functionality, and SuperAdmin delete capability
- Orders tab shows all orders with payment verification details, status management, and payment slip viewing
- Payment Methods tab (SuperAdmin exclusive) enables full CRUD for Bank, eSewa, Khalti, and IME Pay with QR image uploads
- Settings tab includes Social Media Links editing (6 platforms, auto-save)
- Unsaved changes warning protects against accidental navigation when dialogs are open or reply text is pending
- Proper Zustand selectors used throughout for optimal re-render behavior
- Browser beforeunload listener added for external navigation protection
