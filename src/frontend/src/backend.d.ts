import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
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
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
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
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(customerName: string, customerPhone: string, customerEmail: string, paymentMethod: PaymentMethod, deliveryType: DeliveryType, deliveryAddress: string | null): Promise<bigint>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getOrdersByCustomer(customerEmail: string): Promise<Array<Order>>;
    getProductById(productId: string): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    removeFromCart(productId: string): Promise<void>;
    removeProduct(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
