import { Filter, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AdBanner from "../components/AdBanner";
import { useInView } from "../hooks/useInView";
import { type CartItem, getProducts } from "../types";

interface Props {
  navigate: (p: Page, extra?: { productId?: string }) => void;
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
}

type CategoryFilter = "all" | "electrical" | "internet-cafe" | "photo-binding";

export function ProductsPage({ navigate, cart, setCart }: Props) {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const products = getProducts();
  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const { ref: heroRef, inView: heroInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();

  const addToCart = (productId: string, productName: string, price: number) => {
    const existing = cart.find((i) => i.productId === productId);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { productId, productName, price, qty: 1 }]);
    }
    toast.success(`${productName} added to cart`);
  };

  const cats: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "All Products" },
    { value: "electrical", label: "⚡ Electrical" },
    { value: "internet-cafe", label: "🖥 Internet Cafe" },
    { value: "photo-binding", label: "🖼 Photo & Binding" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.98 0.02 15)" }}>
      {/* Pink→Sky gradient header */}
      <div
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className={`py-10 px-6 transition-all duration-700 ${
          heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{
          background:
            "linear-gradient(135deg, oklch(0.88 0.08 10) 0%, oklch(0.87 0.08 200) 100%)",
          borderBottom: "1px solid oklch(0.9 0.04 15)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold gradient-text-ios">
            Our Products &amp; Services
          </h1>
          <p className="text-sm mt-2" style={{ color: "oklch(0.45 0.03 250)" }}>
            Browse all available products and services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdBanner
          slot="4240548434"
          format="fluid"
          layoutKey="-fb+5w+4e-db+86"
          className="mb-6"
        />

        {/* iOS segmented category filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-1 animate-fade-in-up">
          <Filter
            size={16}
            className="shrink-0"
            style={{ color: "oklch(0.81 0.1 20)" }}
          />
          {cats.map((c) => (
            <button
              type="button"
              key={c.value}
              onClick={() => setFilter(c.value)}
              data-ocid={`filter.${c.value}`}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  filter === c.value
                    ? "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))"
                    : "oklch(1 0 0 / 0.7)",
                color: filter === c.value ? "#fff" : "oklch(0.45 0.03 250)",
                border: `1px solid ${filter === c.value ? "transparent" : "oklch(0.88 0.03 15)"}`,
                backdropFilter: "blur(10px)",
                boxShadow:
                  filter === c.value
                    ? "0 2px 8px oklch(0.81 0.1 20 / 0.3)"
                    : "0 1px 4px oklch(0 0 0 / 0.06)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              data-ocid="product.card"
              className={`rounded-2xl overflow-hidden hover-lift transition-all duration-700 ${
                gridInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                background: "oklch(1 0 0 / 0.75)",
                border: "1px solid oklch(0.92 0.03 15)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 12px oklch(0.81 0.1 20 / 0.08)",
                transitionDelay: `${idx * 0.07}s`,
              }}
            >
              <button
                type="button"
                onClick={() => navigate("product", { productId: p.id })}
                className="w-full"
              >
                <div className="aspect-square overflow-hidden rounded-t-2xl">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </button>
              <div className="p-3">
                <button
                  type="button"
                  onClick={() => navigate("product", { productId: p.id })}
                  className="text-left w-full mb-2"
                >
                  <h3
                    className="text-sm font-semibold line-clamp-2 mb-1"
                    style={{ color: "oklch(0.25 0.02 250)" }}
                  >
                    {p.name}
                  </h3>
                  <p className="font-bold text-base gradient-text-pink">
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(p.id, p.name, p.price)}
                  data-ocid="product.add_to_cart"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.75 0.09 15))",
                    color: "#fff",
                    boxShadow: "0 2px 8px oklch(0.81 0.1 20 / 0.3)",
                  }}
                >
                  <ShoppingCart size={13} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
