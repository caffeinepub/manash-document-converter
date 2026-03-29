import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { AiChatPage } from "./pages/AiChatPage";
import { AuthPage } from "./pages/AuthPage";
import { CartPage } from "./pages/CartPage";
import { CertificateAlbumPage } from "./pages/CertificateAlbumPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ContactUsPage } from "./pages/ContactUsPage";
import { ConverterPage } from "./pages/ConverterPage";
import { GovDocumentsPage } from "./pages/GovDocumentsPage";
import { HomePage } from "./pages/HomePage";
import { ImageToolsPage } from "./pages/ImageToolsPage";
import { JobUpdatesPage } from "./pages/JobUpdatesPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductsPage } from "./pages/ProductsPage";
import type { CartItem } from "./types";

export type Page =
  | "home"
  | "shop"
  | "cart"
  | "checkout"
  | "auth"
  | "account"
  | "admin"
  | "product"
  | "converter"
  | "image-tools"
  | "job-updates"
  | "gov-documents"
  | "contact-us"
  | "ai-chat"
  | "certificate-album";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const navigate = (p: Page, extra?: { productId?: string }) => {
    setPage(p);
    if (extra?.productId) setSelectedProductId(extra.productId);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        page={page}
        navigate={navigate}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
      />
      {page === "home" && <HomePage navigate={navigate} />}
      {page === "shop" && (
        <ProductsPage navigate={navigate} cart={cart} setCart={setCart} />
      )}
      {page === "product" && selectedProductId && (
        <ProductDetailPage
          productId={selectedProductId}
          navigate={navigate}
          cart={cart}
          setCart={setCart}
        />
      )}
      {page === "cart" && (
        <CartPage navigate={navigate} cart={cart} setCart={setCart} />
      )}
      {page === "checkout" && (
        <CheckoutPage navigate={navigate} cart={cart} setCart={setCart} />
      )}
      {page === "auth" && <AuthPage navigate={navigate} />}
      {page === "account" && <AccountPage navigate={navigate} />}
      {page === "admin" && <AdminPage navigate={navigate} />}
      {page === "converter" && <ConverterPage />}
      {page === "image-tools" && <ImageToolsPage navigate={navigate} />}
      {page === "job-updates" && <JobUpdatesPage />}
      {page === "gov-documents" && <GovDocumentsPage />}
      {page === "contact-us" && <ContactUsPage />}
      {page === "ai-chat" && <AiChatPage />}
      {page === "certificate-album" && <CertificateAlbumPage />}
      <Toaster />
    </div>
  );
}
