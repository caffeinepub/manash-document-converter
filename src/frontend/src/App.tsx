import { useEffect, useRef, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { useActor } from "./hooks/useActor";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
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
import { forceSetStorageActor, syncFromBackend } from "./utils/adminStorage";

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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Single guard: actor initialization runs exactly once
  const actorInitialized = useRef(false);

  // Safety timeout: if backend sync takes >15 seconds, show the app anyway
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!actorInitialized.current) {
        console.warn(
          "[App] Backend sync timed out after 15s — showing app with local data.",
        );
        setSynced(true);
      }
    }, 15000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On app load, sync all backend admin settings into localStorage.
  useEffect(() => {
    if (!actor || isFetching || actorInitialized.current) return;
    actorInitialized.current = true;
    forceSetStorageActor(actor);
    syncFromBackend(actor).finally(() => {
      setSynced(true);
    });
  }, [actor, isFetching]);

  // Check for music-related params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const musicCat = params.get("musiccat");
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

  // iOS-styled loading spinner
  if (!synced) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1a0a14 0%, #0d0820 100%)"
            : "linear-gradient(135deg, #fff0f7 0%, #f0f8ff 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-5">
          {/* iOS-style spinner ring */}
          <div className="relative w-14 h-14">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "3px solid",
                borderColor: isDark
                  ? "rgba(255,182,217,0.15)"
                  : "rgba(232,93,138,0.15)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                border: "3px solid transparent",
                borderTopColor: isDark ? "#FFB6D9" : "#E85D8A",
                borderRightColor: isDark
                  ? "rgba(180,231,255,0.6)"
                  : "rgba(79,168,224,0.6)",
              }}
            />
          </div>
          <div className="text-center">
            <p
              className="font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, #E85D8A 0%, #4FA8E0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NextGen IT Hub
            </p>
            <p
              className="text-sm mt-1"
              style={{
                color: isDark
                  ? "rgba(255,182,217,0.55)"
                  : "rgba(160,100,130,0.65)",
              }}
            >
              Syncing data from cloud…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        // Add bottom padding on mobile for BottomNav
        paddingBottom: "calc(env(safe-area-inset-bottom) + 64px)",
      }}
    >
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

      {/* iOS-style bottom navigation bar — mobile only */}
      <BottomNav page={page} navigate={navigate} />
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
