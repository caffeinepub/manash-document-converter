import { Minus, Plus, Trash2 } from "lucide-react";
import type { Page } from "../App";
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
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center gap-5"
        style={{ background: "oklch(0.98 0.02 15)" }}
      >
        <div className="text-6xl animate-float">🛒</div>
        <h2
          className="text-xl font-bold"
          style={{ color: "oklch(0.25 0.02 250)" }}
        >
          Your cart is empty
        </h2>
        <p
          className="text-sm text-center max-w-xs"
          style={{ color: "oklch(0.55 0.02 250)" }}
        >
          Add some products to get started
        </p>
        <button
          type="button"
          onClick={() => navigate("shop")}
          data-ocid="cart.shop_now"
          className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-200"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
            boxShadow: "0 4px 16px oklch(0.81 0.1 20 / 0.3)",
          }}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "oklch(0.98 0.02 15)" }}
    >
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-2xl font-extrabold mb-6 gradient-text-ios"
          data-ocid="cart.title"
        >
          Shopping Cart
        </h1>

        {/* iOS-style card list */}
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{
            background: "oklch(1 0 0 / 0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid oklch(0.92 0.03 15)",
            boxShadow: "0 2px 16px oklch(0.81 0.1 20 / 0.08)",
          }}
        >
          {cart.map((item, idx) => (
            <div
              key={item.productId}
              data-ocid="cart.item_row"
              className={`flex items-center gap-3 px-4 py-4 transition-colors ${
                idx < cart.length - 1 ? "border-b" : ""
              }`}
              style={{
                borderColor: "oklch(0.92 0.03 15)",
              }}
            >
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{ color: "oklch(0.25 0.02 250)" }}
                >
                  {item.productName}
                </p>
                <p className="font-bold text-sm gradient-text-pink">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* iOS-style +/- stepper */}
              <div
                className="flex items-center gap-1 rounded-full px-2 py-1"
                style={{
                  background: "oklch(0.95 0.02 15)",
                  border: "1px solid oklch(0.88 0.03 15)",
                }}
              >
                <button
                  type="button"
                  onClick={() => updateQty(item.productId, -1)}
                  data-ocid="cart.qty_minus"
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all"
                  style={{ color: "oklch(0.81 0.1 20)" }}
                >
                  <Minus size={12} />
                </button>
                <span
                  className="w-6 text-center font-bold text-sm tabular-nums"
                  style={{ color: "oklch(0.25 0.02 250)" }}
                >
                  {item.qty}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(item.productId, 1)}
                  data-ocid="cart.qty_plus"
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all"
                  style={{ color: "oklch(0.81 0.1 20)" }}
                >
                  <Plus size={12} />
                </button>
              </div>

              <div
                className="font-bold w-20 text-right text-sm"
                style={{ color: "oklch(0.25 0.02 250)" }}
              >
                ₹{(item.price * item.qty).toLocaleString("en-IN")}
              </div>
              <button
                type="button"
                onClick={() => remove(item.productId)}
                data-ocid="cart.remove"
                className="ml-1 transition-colors"
                style={{ color: "oklch(0.65 0.15 25)" }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Glassmorphism total section */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.92 0.05 15 / 0.7), oklch(0.92 0.05 220 / 0.7))",
            backdropFilter: "blur(10px)",
            border: "1px solid oklch(1 0 0 / 0.4)",
            boxShadow: "0 2px 12px oklch(0.81 0.1 20 / 0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-semibold"
              style={{ color: "oklch(0.45 0.03 250)" }}
            >
              Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)
            </span>
            <span className="text-2xl font-extrabold gradient-text-ios">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("shop")}
            data-ocid="cart.continue_shopping"
            className="flex-1 py-3 rounded-full font-semibold text-sm transition-all duration-200"
            style={{
              background: "oklch(1 0 0 / 0.8)",
              border: "1.5px solid oklch(0.88 0.04 15)",
              color: "oklch(0.45 0.03 250)",
              backdropFilter: "blur(10px)",
            }}
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={() => navigate("checkout")}
            data-ocid="cart.checkout"
            className="flex-1 py-3 rounded-full font-semibold text-sm text-white transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
              boxShadow: "0 4px 16px oklch(0.81 0.1 20 / 0.35)",
            }}
          >
            Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
