import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    imageUrl : Text;
    stockQuantity : Nat;
    isAvailable : Bool;
  };

  type Category = {
    #Electrical;
    #InternetCafe;
    #PhotoBinding;
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    items : [CartItem];
    paymentMethod : PaymentMethod;
    deliveryType : DeliveryType;
    deliveryAddress : ?Text;
    orderStatus : OrderStatus;
    timestamp : Int;
    totalAmount : Nat;
    customerId : Principal;
  };

  type OrderStatus = {
    #Pending;
    #Processing;
    #Completed;
    #Cancelled;
  };

  type PaymentMethod = {
    #UPI;
    #Card;
    #COD;
  };

  type DeliveryType = {
    #Pickup;
    #Delivery;
  };

  // State
  var nextOrderId = 1;
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Nat, Order>();
  let shoppingCarts = Map.empty<Principal, [CartItem]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Stripe integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Helper method to get required (not null) stripe configuration
  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { config };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    canAddProduct(product.category, product);
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    canUpdateProduct(product.category, product);
    products.add(product.id, product);
  };

  public shared ({ caller }) func removeProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove products");
    };
    products.remove(productId);
  };

  // Product Permission Checks
  func canAddProduct(category : Category, product : Product) {
    assertValidProduct(product);
  };

  func canUpdateProduct(category : Category, product : Product) {
    assertValidProduct(product);
  };

  func assertValidProduct(product : Product) {
    if (product.name.size() == 0) {
      Runtime.trap("Product name cannot be empty");
    };
    if (product.price == 0) {
      Runtime.trap("Product price must be greater than 0");
    };
    if (product.stockQuantity == 0) {
      Runtime.trap("Stock quantity must be greater than 0");
    };
  };

  // Product Retrieval (Public - no auth needed)
  public query func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query func getProductById(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Shopping Cart Management (User-only)
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };
    if (quantity < 1) {
      Runtime.trap("Quantity must be at least 1");
    };

    let updatedCart = switch (shoppingCarts.get(caller)) {
      case (null) {
        [{ productId; quantity }];
      };
      case (?cartItems) {
        var found = false;
        let updatedItems = cartItems.map(func(item) {
          if (item.productId == productId) {
            found := true;
            { item with quantity };
          } else {
            item;
          }
        });
        if (not found) {
          updatedItems.concat([{ productId; quantity }]);
        } else {
          updatedItems;
        };
      };
    };
    shoppingCarts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };
    switch (shoppingCarts.get(caller)) {
      case (null) {};
      case (?cartItems) {
        let filteredCart = cartItems.filter(func(item) { item.productId != productId });
        if (filteredCart.size() == 0) {
          shoppingCarts.remove(caller);
        } else {
          shoppingCarts.add(caller, filteredCart);
        };
      };
    };
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view shopping carts");
    };
    switch (shoppingCarts.get(caller)) {
      case (null) { [] };
      case (?cartItems) { cartItems };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };
    shoppingCarts.remove(caller);
  };

  // Order Management
  public shared ({ caller }) func createOrder(customerName : Text, customerPhone : Text, customerEmail : Text, paymentMethod : PaymentMethod, deliveryType : DeliveryType, deliveryAddress : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    let cartItems = switch (shoppingCarts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty");
      };
      case (?cart) {
        if (cart.size() == 0) {
          Runtime.trap("Cart is empty");
        };
        cart;
      };
    };

    let totalAmount = calculateTotalAmount(cartItems);

    let order : Order = {
      id = nextOrderId;
      customerName;
      customerPhone;
      customerEmail;
      items = cartItems;
      paymentMethod;
      deliveryType;
      deliveryAddress;
      orderStatus = #Pending;
      timestamp = Time.now();
      totalAmount;
      customerId = caller;
    };

    orders.add(nextOrderId, order);
    shoppingCarts.remove(caller);
    nextOrderId += 1;
    order.id;
  };

  func calculateTotalAmount(items : [CartItem]) : Nat {
    items.foldLeft(
      0,
      func(acc, item) {
        switch (products.get(item.productId)) {
          case (null) { acc };
          case (?product) {
            acc + (product.price * item.quantity);
          };
        };
      },
    );
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Users can only view their own orders, admins can view all
        if (order.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  public query ({ caller }) func getOrdersByCustomer(customerEmail : Text) : async [Order] {
    // Only admins or the customer themselves can view orders by email
    let filteredOrders = orders.values().toArray().filter(func(order) { 
      order.customerEmail == customerEmail 
    });
    
    // Check if caller is authorized to view these orders
    if (filteredOrders.size() > 0) {
      let firstOrder = filteredOrders[0];
      if (firstOrder.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
        Runtime.trap("Unauthorized: Can only view your own orders");
      };
    };
    
    filteredOrders;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = { order with orderStatus = status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Stripe Store Integration
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfig(), Principal.fromText("2vxsx-fae"), items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
