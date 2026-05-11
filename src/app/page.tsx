"use client";

import { useAppStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import HomePage from "@/components/pages/HomePage";
import ServicesPage from "@/components/pages/ServicesPage";
import ProductsPage from "@/components/pages/ProductsPage";
import CartPage from "@/components/pages/CartPage";
import AppointmentsPage from "@/components/pages/AppointmentsPage";
import GalleryPage from "@/components/pages/GalleryPage";
import ReviewsPage from "@/components/pages/ReviewsPage";
import AdminPanel from "@/components/pages/AdminPanel";
import SuperAdminPanel from "@/components/pages/SuperAdminPanel";
import ProfilePage from "@/components/pages/ProfilePage";
import { LoginPage, RegisterPage } from "@/components/pages/AuthPages";

function PageRouter() {
  const { currentPage } = useAppStore();

  switch (currentPage) {
    case "home":
      return <HomePage />;
    case "services":
      return <ServicesPage />;
    case "products":
      return <ProductsPage />;
    case "cart":
      return <CartPage />;
    case "appointments":
      return <AppointmentsPage />;
    case "gallery":
      return <GalleryPage />;
    case "reviews":
      return <ReviewsPage />;
    case "admin":
      return <AdminPanel />;
    case "superadmin":
      return <SuperAdminPanel />;
    case "profile":
      return <ProfilePage />;
    case "login":
      return <LoginPage />;
    case "register":
      return <RegisterPage />;
    default:
      return <HomePage />;
  }
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PageRouter />
      </main>
      <Footer />
    </div>
  );
}
