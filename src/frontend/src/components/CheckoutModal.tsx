import {
  CheckCircle,
  CreditCard,
  Home,
  Loader2,
  Package,
  Smartphone,
  Store,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type CartItem,
  DeliveryType,
  PaymentMethod,
  type Product,
} from "../backend";
import { useActor } from "../hooks/useActor";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: (CartItem & { product?: Product })[];
  products: Product[];
  onOrderPlaced: (orderId: bigint) => void;
}

export function CheckoutModal({
  open,
  onClose,
  cartItems,
  products,
  onOrderPlaced,
}: CheckoutModalProps) {
  const { actor } = useActor();
  const [step, setStep] = useState<"info" | "confirm" | "done">("info");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.COD,
  );
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    DeliveryType.Pickup,
  );
  const [address, setAddress] = useState("");

  const resolveProduct = (productId: string) =>
    cartItems.find((i) => i.productId === productId)?.product ??
    products.find((p) => p.id === productId);

  const formatPrice = (paise: bigint) =>
    `₹${(Number(paise) / 100).toLocaleString("en-IN")}`;

  const total = cartItems.reduce((sum, item) => {
    const p = resolveProduct(item.productId);
    return sum + (p?.price ?? BigInt(0)) * item.quantity;
  }, BigInt(0));

  const handleSubmit = async () => {
    if (!name || !phone || !email) {
      toast.error("Please fill all required fields");
      return;
    }
    if (deliveryType === DeliveryType.Delivery && !address) {
      toast.error("Please enter delivery address");
      return;
    }
    if (paymentMethod === PaymentMethod.UPI && !upiId) {
      toast.error("Please enter UPI ID");
      return;
    }
    if (!actor) {
      toast.error("Please login to place order");
      return;
    }

    if (paymentMethod === PaymentMethod.Card) {
      setLoading(true);
      try {
        const items = cartItems.map((item) => {
          const p = resolveProduct(item.productId);
          return {
            productName: p?.name ?? item.productId,
            productDescription: p?.description ?? "",
            quantity: item.quantity,
            priceInCents: p?.price ?? BigInt(0),
            currency: "inr",
          };
        });
        const url = await actor.createCheckoutSession(
          items,
          window.location.href,
          window.location.href,
        );
        window.location.href = url;
      } catch {
        toast.error("Card payment unavailable. Please try UPI or COD.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const id = await actor.createOrder(
        name,
        phone,
        email,
        paymentMethod,
        deliveryType,
        deliveryType === DeliveryType.Delivery ? address : null,
      );
      setOrderId(id);
      setStep("done");
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (step === "done" && orderId !== null) {
      onOrderPlaced(orderId);
    }
    setStep("info");
    setOrderId(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            {step === "done" ? "Order Confirmed!" : "Checkout"}
          </DialogTitle>
        </DialogHeader>

        {step === "done" ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="h-16 w-16 rounded-full bg-green-900/40 border border-green-700 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-1">
                Thank you, {name}!
              </p>
              <p className="text-gray-400 text-sm">
                Your order #{String(orderId)} has been placed.
              </p>
              {paymentMethod === PaymentMethod.UPI && (
                <p className="text-cyan-400 text-sm mt-2">
                  Please complete UPI payment to: {upiId}
                </p>
              )}
              {deliveryType === DeliveryType.Pickup ? (
                <p className="text-gray-400 text-sm mt-2">
                  Please pick up from our store.
                </p>
              ) : (
                <p className="text-gray-400 text-sm mt-2">
                  We'll deliver to: {address}
                </p>
              )}
            </div>
            <Button
              onClick={handleClose}
              className="bg-cyan-600 hover:bg-cyan-500 text-white w-full"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Order Summary */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Order Summary
              </h3>
              <div className="space-y-1">
                {cartItems.map((item) => {
                  const p = resolveProduct(item.productId);
                  return (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-400">
                        {p?.name ?? item.productId} × {Number(item.quantity)}
                      </span>
                      <span className="text-white">
                        {p ? formatPrice(p.price * item.quantity) : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-700 mt-3 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-cyan-400">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-gray-300 text-xs">Full Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-300 text-xs">Phone *</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-xs">Email *</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-gray-300 text-xs mb-2 block">
                Payment Method
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: PaymentMethod.COD, label: "COD", icon: Package },
                  { value: PaymentMethod.UPI, label: "UPI", icon: Smartphone },
                  {
                    value: PaymentMethod.Card,
                    label: "Card",
                    icon: CreditCard,
                  },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setPaymentMethod(opt.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all ${
                      paymentMethod === opt.value
                        ? "bg-cyan-900/50 border-cyan-600 text-cyan-400"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <opt.icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
              {paymentMethod === PaymentMethod.UPI && (
                <div className="mt-2">
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              )}
              {paymentMethod === PaymentMethod.Card && (
                <p className="text-xs text-gray-400 mt-2">
                  You'll be redirected to Stripe secure checkout.
                </p>
              )}
            </div>

            {/* Delivery */}
            <div>
              <Label className="text-gray-300 text-xs mb-2 block">
                Delivery Option
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: DeliveryType.Pickup,
                    label: "Pickup In-Store",
                    icon: Store,
                  },
                  {
                    value: DeliveryType.Delivery,
                    label: "Home Delivery",
                    icon: Home,
                  },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setDeliveryType(opt.value)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                      deliveryType === opt.value
                        ? "bg-cyan-900/50 border-cyan-600 text-cyan-400"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <opt.icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
              {deliveryType === DeliveryType.Delivery && (
                <div className="mt-2">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full delivery address"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              )}
            </div>

            <Button
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                `Place Order · ${formatPrice(total)}`
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
