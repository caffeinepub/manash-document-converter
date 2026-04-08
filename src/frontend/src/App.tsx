import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { useActor } from "./hooks/useActor";
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
import {
  forceSetStorageActor,
  setStorageActor,
  syncFromBackend,
} from "./utils/adminStorage";

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
  const [synced, setSynced] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  const { actor, isFetching } = useActor();
  const syncedRef = useRef(false);

  // Safety timeout: if backend sync takes >12 seconds, show the app anyway
  // so the user isn't stuck on the loading screen forever.
  // Uses syncedRef (not synced state) to avoid stale closure lint error.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!syncedRef.current) {
        console.warn(
          "[App] Backend sync timed out after 12s — showing app with local data.",
        );
        setSynced(true);
      }
    }, 12000);
    return () => clearTimeout(timer);
    // syncedRef is a stable ref, no deps needed
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time timeout
  }, []);

  // On app load, sync all backend admin settings into localStorage so
  // existing localStorage.getItem() calls pick up persisted data.
  useEffect(() => {
    if (!actor || isFetching || syncedRef.current) return;
    syncedRef.current = true;
    // Register actor for setAdminData calls — setStorageActor will NOT
    // overwrite a valid actor with null (see adminStorage.ts).
    setStorageActor(actor);
    // Pull all persisted admin data from backend into localStorage
    syncFromBackend(actor).finally(() => {
      setSynced(true);
    });
  }, [actor, isFetching]);

  // When actor changes (e.g. user logs in/out), update the reference.
  // Use forceSetStorageActor so intentional updates always apply.
  useEffect(() => {
    if (actor) {
      forceSetStorageActor(actor);
    }
  }, [actor]);

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

  // Show loading spinner while syncing from backend (first load only)
  if (!synced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-yellow-400 font-semibold text-lg tracking-wide">
            Loading NextGen IT Hub...
          </p>
          <p className="text-yellow-400/60 text-sm">
            Syncing data from cloud...
          </p>
        </div>
      </div>
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
