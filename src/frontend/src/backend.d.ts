import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface ShoppingItem {
    name: string;
    currency: string;
    quantity: bigint;
    amount: bigint;
}
export interface StripeConfiguration {
    secretKey: string;
    publishableKey: string;
}
export interface Order {
    id: bigint;
    customerName: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    customerPhone: string;
    orderStatus: OrderStatus;
    deliveryType: DeliveryType;
    totalAmount: bigint;
    timestamp: bigint;
    customerId: Principal;
    items: Array<CartItem>;
    customerEmail: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface Product {
    id: string;
    stockQuantity: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    category: Category;
    price: bigint;
}
export enum Category {
    InternetCafe = "InternetCafe",
    Electrical = "Electrical",
    PhotoBinding = "PhotoBinding"
}
export enum DeliveryType {
    Delivery = "Delivery",
    Pickup = "Pickup"
}
export enum OrderStatus {
    Cancelled = "Cancelled",
    Processing = "Processing",
    Completed = "Completed",
    Pending = "Pending"
}
export enum PaymentMethod {
    COD = "COD",
    UPI = "UPI",
    Card = "Card"
}
export enum StripeSessionStatus {
    Open = "Open",
    Complete = "Complete",
    Expired = "Expired"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(customerName: string, customerPhone: string, customerEmail: string, paymentMethod: PaymentMethod, deliveryType: DeliveryType, deliveryAddress: string | null): Promise<bigint>;
    deleteAdminSetting(key: string): Promise<void>;
    getAdminSetting(key: string): Promise<string | null>;
    getAllAdminSettings(): Promise<Array<[string, string]>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCart(): Promise<Array<CartItem>>;
    getFounderPhotoHash(): Promise<Uint8Array | null>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getOrdersByCustomer(customerEmail: string): Promise<Array<Order>>;
    getProductById(productId: string): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isStripeConfigured(): Promise<boolean>;
    removeFounderPhoto(): Promise<void>;
    removeFromCart(productId: string): Promise<void>;
    removeProduct(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAdminSetting(key: string, value: string): Promise<void>;
    setFounderPhoto(hash: Uint8Array): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
