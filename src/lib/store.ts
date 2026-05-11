"use client";

import { create } from "zustand";

// ==================== TYPES ====================
export type UserRole = "user" | "admin" | "superadmin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  joinDate: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  userId: string;
  userName: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface GalleryImage {
  id: string;
  url: string;
  addedBy: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  text: string;
  rating: number;
  date: string;
}

export type Page =
  | "home"
  | "services"
  | "products"
  | "cart"
  | "appointments"
  | "gallery"
  | "reviews"
  | "admin"
  | "superadmin"
  | "profile"
  | "login"
  | "register";

// ==================== DEFAULT DATA ====================
const DEFAULT_USERS: User[] = [
  {
    id: "u1",
    name: "Super Admin",
    email: "super@labella.com",
    password: "super123",
    role: "superadmin",
    joinDate: "2024-01-01",
  },
  {
    id: "u2",
    name: "Admin User",
    email: "admin@labella.com",
    password: "admin123",
    role: "admin",
    joinDate: "2024-02-15",
  },
  {
    id: "u3",
    name: "Regular User",
    email: "user@labella.com",
    password: "user123",
    role: "user",
    joinDate: "2024-03-20",
  },
];

const DEFAULT_SERVICES: Service[] = [
  { id: "s1", name: "Haircut & Styling", price: 35, duration: "45 min", icon: "scissors" },
  { id: "s2", name: "Facial Treatment", price: 55, duration: "60 min", icon: "sparkles" },
  { id: "s3", name: "Manicure & Pedicure", price: 45, duration: "50 min", icon: "hand" },
  { id: "s4", name: "Bridal Makeup", price: 150, duration: "120 min", icon: "crown" },
  { id: "s5", name: "Waxing", price: 30, duration: "30 min", icon: "leaf" },
  { id: "s6", name: "Threading", price: 15, duration: "20 min", icon: "pen-tool" },
];

const DEFAULT_PRODUCTS: Product[] = [
  { id: "p1", name: "Rose Hair Oil", price: 25, category: "Hair", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop" },
  { id: "p2", name: "Vitamin C Serum", price: 45, category: "Skin", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop" },
  { id: "p3", name: "Organic Lip Balm", price: 12, category: "Lips", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop" },
  { id: "p4", name: "Hair Mask", price: 30, category: "Hair", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop" },
  { id: "p5", name: "Face Wash", price: 18, category: "Skin", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop" },
];

const DEFAULT_GALLERY: GalleryImage[] = [
  { id: "g1", url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop", addedBy: "u1" },
  { id: "g2", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop", addedBy: "u1" },
  { id: "g3", url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", addedBy: "u2" },
  { id: "g4", url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop", addedBy: "u1" },
  { id: "g5", url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop", addedBy: "u2" },
  { id: "g6", url: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&h=400&fit=crop", addedBy: "u1" },
];

const DEFAULT_REVIEWS: Review[] = [
  { id: "r1", userId: "u3", userName: "Regular User", text: "Amazing experience! The haircut was perfect and the staff was so friendly.", rating: 5, date: "2024-06-15" },
  { id: "r2", userId: "u3", userName: "Regular User", text: "Great facial treatment. My skin feels rejuvenated!", rating: 4, date: "2024-07-20" },
  { id: "r3", userId: "u2", userName: "Admin User", text: "The bridal makeup was stunning. Highly recommend for special occasions.", rating: 5, date: "2024-08-10" },
];

// ==================== HELPER ====================
function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ==================== STORE INTERFACE ====================
interface AppState {
  // Hydration
  _hydrated: boolean;
  _hasHydrated: () => boolean;
  hydrate: () => void;

  // Navigation
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => boolean;

  // Users
  users: User[];
  setUsers: (users: User[]) => void;
  changeUserRole: (userId: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;

  // Services
  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (serviceId: string, serviceName: string, date: string) => void;
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;

  // Site Settings
  homeButtonText: string;
  setHomeButtonText: (text: string) => void;

  // Gallery
  gallery: GalleryImage[];
  addGalleryImage: (url: string) => void;
  deleteGalleryImage: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (text: string, rating: number) => void;
  deleteReview: (id: string) => void;
}

// ==================== LOCALSTORAGE HELPERS ====================
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail
  }
}

// ==================== CREATE STORE ====================
// Store is created with DEFAULT values first (safe for SSR),
// then hydrated from localStorage on the client via hydrate()
export const useAppStore = create<AppState>((set, get) => ({
  // Hydration state
  _hydrated: false,
  _hasHydrated: () => get()._hydrated,
  hydrate: () => {
    if (get()._hydrated) return; // Only hydrate once

    const users = loadFromStorage<User[]>("labella_users", DEFAULT_USERS);
    const services = loadFromStorage<Service[]>("labella_services", DEFAULT_SERVICES);
    const products = loadFromStorage<Product[]>("labella_products", DEFAULT_PRODUCTS);
    const cart = loadFromStorage<CartItem[]>("labella_cart", []);
    const appointments = loadFromStorage<Appointment[]>("labella_appointments", []);
    const gallery = loadFromStorage<GalleryImage[]>("labella_gallery", DEFAULT_GALLERY);
    const reviews = loadFromStorage<Review[]>("labella_reviews", DEFAULT_REVIEWS);
    const homeButtonText = loadFromStorage<string>("labella_home_button_text", "Home");

    let currentUser: User | null = null;
    const storedUserId = localStorage.getItem("labella_current_user_id");
    if (storedUserId) {
      currentUser = users.find((u) => u.id === storedUserId) || null;
    }

    set({
      _hydrated: true,
      users,
      services,
      products,
      cart,
      appointments,
      gallery,
      reviews,
      homeButtonText,
      currentUser,
    });
  },

  // Navigation
  currentPage: "home" as Page,
  setCurrentPage: (page) => set({ currentPage: page }),

  // Auth - default to null (will be set after hydration)
  currentUser: null,
  login: (email, password) => {
    const users = get().users;
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      set({ currentUser: user, currentPage: "home" });
      localStorage.setItem("labella_current_user_id", user.id);
      return true;
    }
    return false;
  },
  register: (name, email, password) => {
    const users = get().users;
    if (users.find((u) => u.email === email)) return false;
    const newUser: User = {
      id: genId(),
      name,
      email,
      password,
      role: "user",
      joinDate: new Date().toISOString().split("T")[0],
    };
    const updatedUsers = [...users, newUser];
    set({ users: updatedUsers, currentUser: newUser, currentPage: "home" });
    saveToStorage("labella_users", updatedUsers);
    localStorage.setItem("labella_current_user_id", newUser.id);
    return true;
  },
  logout: () => {
    set({ currentUser: null, currentPage: "home", cart: [] });
    localStorage.removeItem("labella_current_user_id");
    saveToStorage("labella_cart", []);
  },
  changePassword: (oldPass, newPass) => {
    const user = get().currentUser;
    if (!user || user.password !== oldPass) return false;
    const users = get().users.map((u) =>
      u.id === user.id ? { ...u, password: newPass } : u
    );
    const updatedUser = { ...user, password: newPass };
    set({ users, currentUser: updatedUser });
    saveToStorage("labella_users", users);
    return true;
  },

  // Users - defaults (will be replaced on hydration)
  users: DEFAULT_USERS,
  setUsers: (users) => {
    set({ users });
    saveToStorage("labella_users", users);
  },
  changeUserRole: (userId, role) => {
    const users = get().users.map((u) =>
      u.id === userId ? { ...u, role } : u
    );
    set({ users });
    saveToStorage("labella_users", users);
    // Update current user if their role changed
    const current = get().currentUser;
    if (current && current.id === userId) {
      set({ currentUser: { ...current, role } });
    }
  },
  deleteUser: (userId) => {
    const current = get().currentUser;
    if (current && current.id === userId) return; // can't delete self
    const users = get().users.filter((u) => u.id !== userId);
    set({ users });
    saveToStorage("labella_users", users);
  },

  // Services - defaults
  services: DEFAULT_SERVICES,
  addService: (service) => {
    const services = [...get().services, { ...service, id: genId() }];
    set({ services });
    saveToStorage("labella_services", services);
  },
  updateService: (id, service) => {
    const services = get().services.map((s) =>
      s.id === id ? { ...s, ...service } : s
    );
    set({ services });
    saveToStorage("labella_services", services);
  },
  deleteService: (id) => {
    const services = get().services.filter((s) => s.id !== id);
    set({ services });
    saveToStorage("labella_services", services);
  },

  // Products - defaults
  products: DEFAULT_PRODUCTS,
  addProduct: (product) => {
    const products = [...get().products, { ...product, id: genId() }];
    set({ products });
    saveToStorage("labella_products", products);
  },
  updateProduct: (id, product) => {
    const products = get().products.map((p) =>
      p.id === id ? { ...p, ...product } : p
    );
    set({ products });
    saveToStorage("labella_products", products);
  },
  deleteProduct: (id) => {
    const products = get().products.filter((p) => p.id !== id);
    set({ products });
    saveToStorage("labella_products", products);
  },

  // Cart - defaults
  cart: [],
  addToCart: (productId) => {
    const cart = get().cart;
    const existing = cart.find((c) => c.productId === productId);
    let updatedCart: CartItem[];
    if (existing) {
      updatedCart = cart.map((c) =>
        c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c
      );
    } else {
      updatedCart = [...cart, { productId, quantity: 1 }];
    }
    set({ cart: updatedCart });
    saveToStorage("labella_cart", updatedCart);
  },
  removeFromCart: (productId) => {
    const updatedCart = get().cart.filter((c) => c.productId !== productId);
    set({ cart: updatedCart });
    saveToStorage("labella_cart", updatedCart);
  },
  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const updatedCart = get().cart.map((c) =>
      c.productId === productId ? { ...c, quantity } : c
    );
    set({ cart: updatedCart });
    saveToStorage("labella_cart", updatedCart);
  },
  clearCart: () => {
    set({ cart: [] });
    saveToStorage("labella_cart", []);
  },

  // Appointments - defaults
  appointments: [],
  addAppointment: (serviceId, serviceName, date) => {
    const user = get().currentUser;
    if (!user) return;
    const appointment: Appointment = {
      id: genId(),
      serviceId,
      serviceName,
      date,
      userId: user.id,
      userName: user.name,
      status: "pending",
    };
    const appointments = [...get().appointments, appointment];
    set({ appointments });
    saveToStorage("labella_appointments", appointments);
  },
  confirmAppointment: (id) => {
    const appointments = get().appointments.map((a) =>
      a.id === id ? { ...a, status: "confirmed" as const } : a
    );
    set({ appointments });
    saveToStorage("labella_appointments", appointments);
  },
  cancelAppointment: (id) => {
    const appointments = get().appointments.map((a) =>
      a.id === id ? { ...a, status: "cancelled" as const } : a
    );
    set({ appointments });
    saveToStorage("labella_appointments", appointments);
  },

  // Site Settings - defaults
  homeButtonText: "Home",
  setHomeButtonText: (text) => {
    set({ homeButtonText: text });
    saveToStorage("labella_home_button_text", text);
  },

  // Gallery - defaults
  gallery: DEFAULT_GALLERY,
  addGalleryImage: (url) => {
    const user = get().currentUser;
    if (!user) return;
    const image: GalleryImage = {
      id: genId(),
      url,
      addedBy: user.id,
    };
    const gallery = [...get().gallery, image];
    set({ gallery });
    saveToStorage("labella_gallery", gallery);
  },
  deleteGalleryImage: (id) => {
    const gallery = get().gallery.filter((g) => g.id !== id);
    set({ gallery });
    saveToStorage("labella_gallery", gallery);
  },

  // Reviews - defaults
  reviews: DEFAULT_REVIEWS,
  addReview: (text, rating) => {
    const user = get().currentUser;
    if (!user) return;
    const review: Review = {
      id: genId(),
      userId: user.id,
      userName: user.name,
      text,
      rating,
      date: new Date().toISOString().split("T")[0],
    };
    const reviews = [...get().reviews, review];
    set({ reviews });
    saveToStorage("labella_reviews", reviews);
  },
  deleteReview: (id) => {
    const reviews = get().reviews.filter((r) => r.id !== id);
    set({ reviews });
    saveToStorage("labella_reviews", reviews);
  },
}));
