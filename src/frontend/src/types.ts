export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "electrical" | "internet-cafe" | "photo-binding";
  imageUrl: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  deliveryType: "pickup" | "delivery";
  deliveryAddress?: string;
  paymentMethod: "upi" | "card" | "cod" | "razorpay";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface CustomerSession {
  id: string;
  name: string;
  phone: string;
  email: string;
  isLoggedIn: boolean;
}

export interface AdminConfig {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  shiprocketEmail: string;
  shiprocketPassword: string;
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: "e1",
    name: "LED Bulb Pack 10W",
    description:
      "Energy-saving 10W LED bulb, pack of 4. Long lasting up to 25,000 hours.",
    price: 299,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    inStock: true,
  },
  {
    id: "e2",
    name: "Ceiling Fan 48 inch",
    description:
      "High-speed 48 inch ceiling fan with 3 speed settings. Energy efficient motor.",
    price: 2499,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    inStock: true,
  },
  {
    id: "e3",
    name: "6-Socket Extension Board",
    description:
      "Heavy duty 6-socket extension board with surge protection and 5-meter cord.",
    price: 599,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1625948515291-699e12b77e6d?w=400&q=80",
    inStock: true,
  },
  {
    id: "e4",
    name: "3-in-1 USB Charger",
    description:
      "Fast charging 3-in-1 USB charger compatible with all smartphones.",
    price: 349,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
    inStock: true,
  },
  {
    id: "e5",
    name: "Smart WiFi Switch",
    description:
      "App-controlled smart switch. Works with Alexa and Google Home.",
    price: 1299,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
    inStock: true,
  },
  {
    id: "ic1",
    name: "1 Hour Internet Browsing",
    description:
      "High-speed internet access for 1 hour. Available at our internet cafe.",
    price: 30,
    category: "internet-cafe",
    imageUrl:
      "https://images.unsplash.com/photo-1606193144096-f18ab72e0a02?w=400&q=80",
    inStock: true,
  },
  {
    id: "ic2",
    name: "Gaming Session 2 Hours",
    description:
      "2-hour gaming session on our high-end gaming PCs with headphones.",
    price: 100,
    category: "internet-cafe",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
    inStock: true,
  },
  {
    id: "ic3",
    name: "Print / Scan per Page",
    description:
      "Color or black & white printing and scanning service per page.",
    price: 10,
    category: "internet-cafe",
    imageUrl:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80",
    inStock: true,
  },
  {
    id: "pb1",
    name: "Spiral Binding",
    description:
      "Professional spiral binding for documents, reports, and presentations.",
    price: 150,
    category: "photo-binding",
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    inStock: true,
  },
  {
    id: "pb2",
    name: "A4 Lamination",
    description: "High gloss or matte lamination for A4 size documents.",
    price: 50,
    category: "photo-binding",
    imageUrl:
      "https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=400&q=80",
    inStock: true,
  },
  {
    id: "pb3",
    name: "4x6 Photo Print",
    description: "Vivid 4x6 inch photo prints on premium glossy paper.",
    price: 25,
    category: "photo-binding",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    inStock: true,
  },
];

export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem("products");
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem("products", JSON.stringify(SEED_PRODUCTS));
  return SEED_PRODUCTS;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem("products", JSON.stringify(products));
}

export function getOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

export function getCustomerSession(): CustomerSession | null {
  try {
    return JSON.parse(localStorage.getItem("customerSession") || "null");
  } catch {
    return null;
  }
}

export function getAdminConfig(): AdminConfig {
  try {
    return JSON.parse(localStorage.getItem("adminConfig") || "{}");
  } catch {
    return {} as AdminConfig;
  }
}
