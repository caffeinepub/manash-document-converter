import { ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { CartItem, Product } from "../backend";
import { CheckoutModal } from "./CheckoutModal";
import { Button } from "./ui/button";
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

  const formatPrice = (paise: bigint) =>
    `₹${(Number(paise) / 100).toLocaleString("en-IN")}`;

  const total = localCart.reduce((sum, item) => {
    const price = item.product?.price ?? BigInt(0);
    return sum + price * item.quantity;
  }, BigInt(0));

  const removeItem = (productId: string) => {
    setLocalCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="bg-gray-900 border-l border-gray-800 text-white w-full max-w-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-white">
              <ShoppingCart className="h-5 w-5 text-cyan-400" />
              Shopping Cart
            </SheetTitle>
          </SheetHeader>

          {localCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-3 py-4">
                {localCart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 bg-gray-800 rounded-xl p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {item.product?.name ?? item.productId}
                      </div>
                      <div className="text-xs text-gray-400">
                        Qty: {Number(item.quantity)} ×{" "}
                        {item.product ? formatPrice(item.product.price) : ""}
                      </div>
                    </div>
                    <div className="text-cyan-400 font-semibold text-sm">
                      {item.product
                        ? formatPrice(item.product.price * item.quantity)
                        : ""}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 pb-6 space-y-3">
                <div className="flex justify-between text-white font-semibold">
                  <span>Total</span>
                  <span className="text-cyan-400">{formatPrice(total)}</span>
                </div>
                <Button
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
                  onClick={() => {
                    onClose();
                    setCheckoutOpen(true);
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setLocalCart([])}
                >
                  <X className="h-4 w-4 mr-2" /> Clear Cart
                </Button>
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
