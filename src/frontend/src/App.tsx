import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./hooks/useTheme";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { AiChatPage } from "./pages/AiChatPage";
import { AssamFormsPage } from "./pages/AssamFormsPage";
import { AssamTourismPage } from "./pages/AssamTourismPage";
import { AuthPage } from "./pages/AuthPage";
import { CartPage } from "./pages/CartPage";
import { CertificateAlbumPage } from "./pages/CertificateAlbumPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ContactUsPage } from "./pages/ContactUsPage";
import { ConverterPage } from "./pages/ConverterPage";
import { EntertainmentPage } from "./pages/EntertainmentPage";
import { GovDocumentsPage } from "./pages/GovDocumentsPage";
import { HomePage } from "./pages/HomePage";
import { ImageToolsPage } from "./pages/ImageToolsPage";
import { JobUpdatesPage } from "./pages/JobUpdatesPage";
import { MusicCategoryPage } from "./pages/MusicCategoryPage";
import { PanCardPortalPage } from "./pages/PanCardPortalPage";
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
  | "assam-forms"
  | "contact-us"
  | "ai-chat"
  | "certificate-album"
  | "pan-card"
  | "entertainment"
  | "assam-tourism"
  | "music-category";

function AppInner() {
  const [page, setPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [musicCategory, setMusicCategory] = useState<string>("Bihu");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  // Check for music-related params on mount — if present, render the music category page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Legacy param
    const musicCat = params.get("musiccat");
    // New params
    const cat = params.get("cat");
    const singer = params.get("singer");
    const movie = params.get("movie");

    if (musicCat) {
      setMusicCategory(musicCat);
      setPage("music-category");
    } else if (cat) {
      setMusicCategory(`__cat__${cat}`);
      setPage("music-category");
    } else if (singer) {
      setMusicCategory(`__singer__${singer}`);
      setPage("music-category");
    } else if (movie) {
      setMusicCategory(`__movie__${movie}`);
      setPage("music-category");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const navigate = (p: Page, extra?: { productId?: string }) => {
    setPage(p);
    if (extra?.productId) setSelectedProductId(extra.productId);
    window.scrollTo(0, 0);
  };

  // When on music-category page, render standalone (no header/footer nav)
  if (page === "music-category") {
    return (
      <>
        <MusicCategoryPage category={musicCategory} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen">
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
      {page === "gov-documents" && <GovDocumentsPage navigate={navigate} />}
      {page === "assam-forms" && <AssamFormsPage navigate={navigate} />}
      {page === "contact-us" && <ContactUsPage />}
      {page === "ai-chat" && <AiChatPage />}
      {page === "certificate-album" && <CertificateAlbumPage />}
      {page === "pan-card" && <PanCardPortalPage />}
      {page === "entertainment" && <EntertainmentPage navigate={navigate} />}
      {page === "assam-tourism" && <AssamTourismPage navigate={navigate} />}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
