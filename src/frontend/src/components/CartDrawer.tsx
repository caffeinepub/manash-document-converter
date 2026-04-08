import { ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import type { CartItem, Product } from "../types";
import { CheckoutModal } from "./CheckoutModal";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  localCart: (CartItem & { product?: Product })[];
  setLocalCart: React.Dispatch<
    React.SetStateAction<(CartItem & { product?: Product })[]>
  >;
}

export function CartDrawer({
  open,
  onClose,
  localCart,
  setLocalCart,
}: CartDrawerProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const formatPrice = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  const total = localCart.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    return sum + price * (item.qty ?? 1);
  }, 0);

  const removeItem = (productId: string) => {
    setLocalCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const sheetBg = isDark ? "rgba(26,10,20,0.97)" : "rgba(255,252,254,0.97)";
  const borderColor = isDark
    ? "rgba(255,182,217,0.18)"
    : "rgba(180,231,255,0.5)";
  const itemBg = isDark ? "rgba(255,182,217,0.06)" : "rgba(180,231,255,0.12)";

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          className="w-full max-w-sm flex flex-col"
          style={{
            background: sheetBg,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderLeft: `1px solid ${borderColor}`,
            color: isDark ? "rgba(255,240,248,0.9)" : "rgba(40,20,35,0.9)",
          }}
        >
          <SheetHeader
            className="pb-3"
            style={{ borderBottom: `1px solid ${borderColor}` }}
          >
            <SheetTitle
              className="flex items-center gap-2 text-base font-semibold"
              style={{
                background: "linear-gradient(135deg, #E85D8A 0%, #4FA8E0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <ShoppingCart className="h-5 w-5" style={{ color: "#E85D8A" }} />
              Shopping Cart
            </SheetTitle>
          </SheetHeader>

          {localCart.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center flex-1 gap-3"
              style={{
                color: isDark
                  ? "rgba(255,182,217,0.4)"
                  : "rgba(180,100,130,0.4)",
              }}
            >
              <ShoppingCart className="h-14 w-14" style={{ opacity: 0.25 }} />
              <p className="text-sm font-medium">Your cart is empty</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232,93,138,0.15), rgba(79,168,224,0.15))",
                  border: "1px solid rgba(232,93,138,0.3)",
                  color: isDark ? "#FFB6D9" : "#C84880",
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Items list */}
              <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
                {localCart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 rounded-2xl p-3 transition-all duration-200"
                    style={{
                      background: itemBg,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-semibold truncate"
                        style={{
                          color: isDark
                            ? "rgba(255,240,248,0.9)"
                            : "rgba(40,20,35,0.9)",
                        }}
                      >
                        {item.product?.name ?? item.productId}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          color: isDark
                            ? "rgba(255,182,217,0.55)"
                            : "rgba(160,100,130,0.7)",
                        }}
                      >
                        Qty: {item.qty ?? 1}
                        {item.product
                          ? ` × ${formatPrice(item.product.price)}`
                          : ""}
                      </div>
                    </div>
                    <div
                      className="text-sm font-bold flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #E85D8A, #4FA8E0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {item.product
                        ? formatPrice(item.product.price * (item.qty ?? 1))
                        : ""}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110"
                      style={{
                        background: "rgba(232,93,138,0.10)",
                        color: "#E85D8A",
                      }}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="pt-4 space-y-3"
                style={{ borderTop: `1px solid ${borderColor}` }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isDark
                        ? "rgba(255,240,248,0.7)"
                        : "rgba(80,50,70,0.7)",
                    }}
                  >
                    Total
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{
                      background: "linear-gradient(135deg, #E85D8A, #4FA8E0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, #E85D8A 0%, #4FA8E0 100%)",
                    boxShadow: "0 4px 16px rgba(232,93,138,0.35)",
                  }}
                  onClick={() => {
                    onClose();
                    setCheckoutOpen(true);
                  }}
                >
                  Proceed to Checkout
                </button>

                <button
                  type="button"
                  className="w-full py-2.5 rounded-2xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: "transparent",
                    border: `1px solid ${borderColor}`,
                    color: isDark
                      ? "rgba(255,182,217,0.6)"
                      : "rgba(180,100,130,0.6)",
                  }}
                  onClick={() => setLocalCart([])}
                >
                  <X className="inline h-3.5 w-3.5 mr-1.5" />
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={localCart}
        products={[]}
        onOrderPlaced={() => {
          setLocalCart([]);
          setCheckoutOpen(false);
        }}
      />
    </>
  );
}
