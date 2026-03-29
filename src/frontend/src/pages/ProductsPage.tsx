import { Filter, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";
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
    <div className="bg-[#F3F5F8] min-h-screen">
      <div className="bg-[#0B2A4A] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold">Our Products & Services</h1>
          <p className="text-gray-300 mt-2 text-sm">
            Browse all available products and services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* AdSense - Products Page */}
        <AdBanner
          slot="4240548434"
          format="fluid"
          layoutKey="-fb+5w+4e-db+86"
          className="mb-6"
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Filter size={18} className="text-gray-500 mt-2" />
          {cats.map((c) => (
            <button
              type="button"
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === c.value
                  ? "bg-[#0B2A4A] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#1E88FF] hover:text-[#1E88FF]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
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
                  <h3 className="text-sm font-semibold text-[#0B2A4A] mb-1 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-[#1E88FF] font-bold text-base">
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                </button>
                <Button
                  onClick={() => addToCart(p.id, p.name, p.price)}
                  className="w-full mt-3 bg-[#0B2A4A] hover:bg-[#1E88FF] text-white text-xs py-2 rounded-lg"
                  size="sm"
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
