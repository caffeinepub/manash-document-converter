import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Page } from "../App";
import { Button } from "../components/ui/button";
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
      <div className="text-center py-20">
        <p className="text-gray-500">Product not found</p>
        <Button onClick={() => navigate("shop")} className="mt-4">
          Back to Shop
        </Button>
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
    <div className="min-h-screen bg-[#F3F5F8] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("shop")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#0B2A4A] mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-full rounded-xl object-cover aspect-square"
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                {p.category.replace("-", " ")}
              </span>
              <h1 className="text-2xl font-extrabold text-[#0B2A4A] mt-2 mb-3">
                {p.name}
              </h1>
              <p className="text-gray-600 text-sm mb-4">{p.description}</p>
              <div className="text-3xl font-extrabold text-[#1E88FF] mb-6">
                ₹{p.price.toLocaleString("en-IN")}
              </div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 ${
                  p.inStock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {p.inStock ? "In Stock" : "Out of Stock"}
              </div>
            </div>
            <Button
              onClick={addToCart}
              disabled={!p.inStock}
              className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white py-4 rounded-xl font-semibold text-base"
            >
              <ShoppingCart size={20} className="mr-2" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
