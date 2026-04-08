import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Page } from "../App";
import { type CartItem, getProducts } from "../types";

interface Props {
  productId: string;
  navigate: (p: Page) => void;
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
}

export function ProductDetailPage({
  productId,
  navigate,
  cart,
  setCart,
}: Props) {
  const products = getProducts();
  const p = products.find((x) => x.id === productId);

  if (!p)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "oklch(0.98 0.02 15)" }}
      >
        <p style={{ color: "oklch(0.55 0.02 250)" }}>Product not found</p>
        <button
          type="button"
          onClick={() => navigate("shop")}
          className="px-6 py-3 rounded-full font-semibold text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
          }}
        >
          Back to Shop
        </button>
      </div>
    );

  const addToCart = () => {
    const existing = cart.find((i) => i.productId === p.id);
    if (existing) {
      setCart(
        cart.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + 1 } : i)),
      );
    } else {
      setCart([
        ...cart,
        { productId: p.id, productName: p.name, price: p.price, qty: 1 },
      ]);
    }
    toast.success(`${p.name} added to cart`);
  };

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "oklch(0.98 0.02 15)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("shop")}
          className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors"
          style={{ color: "oklch(0.81 0.1 20)" }}
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        {/* Product card — glassmorphism */}
        <div
          className="rounded-2xl p-6 flex flex-col md:flex-row gap-8"
          style={{
            background: "oklch(1 0 0 / 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid oklch(0.92 0.03 15)",
            boxShadow: "0 4px 24px oklch(0.81 0.1 20 / 0.1)",
          }}
        >
          {/* Product image */}
          <div className="md:w-1/2">
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="md:w-1/2 flex flex-col justify-between gap-4">
            <div>
              <span
                className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full"
                style={{
                  background: "oklch(0.92 0.05 220 / 0.4)",
                  color: "oklch(0.5 0.1 220)",
                }}
              >
                {p.category.replace("-", " ")}
              </span>
              <h1
                className="text-2xl font-extrabold mt-3 mb-2"
                style={{ color: "oklch(0.25 0.02 250)" }}
              >
                {p.name}
              </h1>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "oklch(0.55 0.02 250)" }}
              >
                {p.description}
              </p>

              {/* Price — Pink gradient text */}
              <div className="text-4xl font-extrabold gradient-text-pink mb-4">
                ₹{p.price.toLocaleString("en-IN")}
              </div>

              {/* Stock badge */}
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold"
                style={
                  p.inStock
                    ? {
                        background: "oklch(0.9 0.08 145 / 0.3)",
                        color: "oklch(0.45 0.15 145)",
                        border: "1px solid oklch(0.75 0.1 145 / 0.3)",
                      }
                    : {
                        background: "oklch(0.92 0.05 25 / 0.3)",
                        color: "oklch(0.55 0.15 25)",
                        border: "1px solid oklch(0.75 0.1 25 / 0.3)",
                      }
                }
              >
                {p.inStock ? "✓ In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* iOS-style Add to Cart button */}
            <button
              type="button"
              onClick={addToCart}
              disabled={!p.inStock}
              data-ocid="product.add_to_cart"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-base transition-all duration-200"
              style={{
                background: p.inStock
                  ? "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.75 0.09 15))"
                  : "oklch(0.88 0.02 250)",
                color: p.inStock ? "#fff" : "oklch(0.65 0.02 250)",
                boxShadow: p.inStock
                  ? "0 4px 16px oklch(0.81 0.1 20 / 0.35)"
                  : "none",
                cursor: p.inStock ? "pointer" : "not-allowed",
              }}
            >
              <ShoppingCart size={20} />
              {p.inStock ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
