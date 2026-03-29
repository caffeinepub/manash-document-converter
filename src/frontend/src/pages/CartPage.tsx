import { Minus, Plus, Trash2 } from "lucide-react";
import type { Page } from "../App";
import { Button } from "../components/ui/button";
import type { CartItem } from "../types";

interface Props {
  navigate: (p: Page) => void;
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
}

export function CartPage({ navigate, cart, setCart }: Props) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const updateQty = (productId: string, delta: number) => {
    setCart(
      cart
        .map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + delta } : i,
        )
        .filter((i) => i.qty > 0),
    );
  };

  const remove = (productId: string) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#F3F5F8]">
        <div className="text-5xl">🛒</div>
        <h2 className="text-xl font-bold text-[#0B2A4A]">Your cart is empty</h2>
        <p className="text-gray-500 text-sm">
          Add some products to get started
        </p>
        <Button
          onClick={() => navigate("shop")}
          className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white rounded-full px-8"
        >
          Shop Now
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F5F8] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold text-[#0B2A4A] mb-6">
          Shopping Cart
        </h1>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {cart.map((item, idx) => (
            <div
              key={item.productId}
              className={`flex items-center gap-4 p-4 ${
                idx < cart.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0B2A4A] text-sm">
                  {item.productName}
                </p>
                <p className="text-[#1E88FF] font-bold">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQty(item.productId, -1)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center font-bold text-sm">
                  {item.qty}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(item.productId, 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <Plus size={12} />
                </button>
              </div>
              <div className="font-bold text-[#0B2A4A] w-20 text-right">
                ₹{(item.price * item.qty).toLocaleString("en-IN")}
              </div>
              <button
                type="button"
                onClick={() => remove(item.productId)}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <span className="font-semibold text-gray-600">Total</span>
            <span className="text-xl font-extrabold text-[#0B2A4A]">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => navigate("shop")}
            variant="outline"
            className="flex-1 rounded-xl border-gray-300"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate("checkout")}
            className="flex-1 bg-[#0B2A4A] hover:bg-[#1E88FF] text-white rounded-xl"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
