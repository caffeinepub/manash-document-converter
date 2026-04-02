import { Filter, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";
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
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      <div
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className={`py-10 px-6 transition-all duration-700 ${
          heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.04 250) 0%, oklch(0.18 0.06 260) 100%)",
          borderBottom: "1px solid oklch(0.25 0.06 250)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold font-display gradient-text-gold">
            Our Products &amp; Services
          </h1>
          <p className="text-sm mt-2" style={{ color: "oklch(0.6 0.04 240)" }}>
            Browse all available products and services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AdBanner
          slot="4240548434"
          format="fluid"
          layoutKey="-fb+5w+4e-db+86"
          className="mb-6"
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up">
          <Filter
            size={18}
            className="mt-2"
            style={{ color: "oklch(0.6 0.04 240)" }}
          />
          {cats.map((c) => (
            <button
              type="button"
              key={c.value}
              onClick={() => setFilter(c.value)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background:
                  filter === c.value
                    ? "oklch(0.78 0.18 65)"
                    : "oklch(0.18 0.05 250)",
                color:
                  filter === c.value
                    ? "oklch(0.12 0.03 250)"
                    : "oklch(0.75 0.04 240)",
                border: `1px solid ${
                  filter === c.value
                    ? "oklch(0.78 0.18 65)"
                    : "oklch(0.25 0.06 250)"
                }`,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              className={`rounded-xl overflow-hidden hover-lift transition-all duration-700 ${
                gridInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                background: "oklch(0.16 0.04 250)",
                border: "1px solid oklch(0.25 0.06 250)",
                transitionDelay: `${idx * 0.07}s`,
              }}
            >
              <button
                type="button"
                onClick={() => navigate("product", { productId: p.id })}
                className="w-full"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </button>
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => navigate("product", { productId: p.id })}
                  className="text-left w-full"
                >
                  <h3
                    className="text-sm font-semibold mb-1 line-clamp-2"
                    style={{ color: "oklch(0.92 0.02 240)" }}
                  >
                    {p.name}
                  </h3>
                  <p
                    className="font-bold text-base"
                    style={{ color: "oklch(0.78 0.18 65)" }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                </button>
                <Button
                  onClick={() => addToCart(p.id, p.name, p.price)}
                  className="w-full mt-3 text-xs py-2 rounded-lg"
                  size="sm"
                  style={{
                    background: "oklch(0.78 0.18 65)",
                    color: "oklch(0.12 0.03 250)",
                  }}
                >
                  <ShoppingCart size={14} className="mr-1" /> Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
