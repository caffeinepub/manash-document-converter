import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {

  // ─── Types ───────────────────────────────────────────────────────────────

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

  // Stripe types (inlined — no external package dependency)
  public type StripeConfiguration = {
    secretKey : Text;
    publishableKey : Text;
  };

  public type ShoppingItem = {
    name : Text;
    amount : Nat;
    quantity : Nat;
    currency : Text;
  };

  public type StripeSessionStatus = {
    #Open;
    #Complete;
    #Expired;
  };

  // ─── State ───────────────────────────────────────────────────────────────

  var founderPhotoHash : ?Blob = null;
  var nextOrderId = 1;
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Nat, Order>();
  let shoppingCarts = Map.empty<Principal, [CartItem]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let adminSettings = Map.empty<Text, Text>();
  var stripeConfig : ?StripeConfiguration = null;

  // ─── Stripe Helpers ──────────────────────────────────────────────────────

  func getStripeConfig() : StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { config };
    };
  };

  // ─── User Profile Management ─────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // ─── Product Management ──────────────────────────────────────────────────

  public shared ({ caller }) func addProduct(product : Product) : async () {
    assertValidProduct(product);
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    assertValidProduct(product);
    products.add(product.id, product);
  };

  public shared ({ caller }) func removeProduct(productId : Text) : async () {
    products.remove(productId);
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

  // ─── Product Retrieval ───────────────────────────────────────────────────

  public query func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query func getProductById(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // ─── Shopping Cart Management ────────────────────────────────────────────

  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
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
    switch (shoppingCarts.get(caller)) {
      case (null) { [] };
      case (?cartItems) { cartItems };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    shoppingCarts.remove(caller);
  };

  // ─── Order Management ────────────────────────────────────────────────────

  public shared ({ caller }) func createOrder(
    customerName : Text,
    customerPhone : Text,
    customerEmail : Text,
    paymentMethod : PaymentMethod,
    deliveryType : DeliveryType,
    deliveryAddress : ?Text,
  ) : async Nat {
    let cartItems = switch (shoppingCarts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) {
        if (cart.size() == 0) { Runtime.trap("Cart is empty") };
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
          case (?product) { acc + (product.price * item.quantity) };
        };
      },
    );
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    orders.get(orderId);
  };

  public query ({ caller }) func getOrdersByCustomer(customerEmail : Text) : async [Order] {
    orders.values().toArray().filter(func(order) {
      order.customerEmail == customerEmail
    });
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        orders.add(orderId, { order with orderStatus = status });
      };
    };
  };

  // ─── Stripe Integration ──────────────────────────────────────────────────

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : StripeConfiguration) : async () {
    stripeConfig := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [ShoppingItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    Runtime.trap("Stripe checkout requires http-outcalls extension");
  };

  public func getStripeSessionStatus(sessionId : Text) : async StripeSessionStatus {
    Runtime.trap("Stripe session status requires http-outcalls extension");
  };

  // ─── Founder Photo Management ─────────────────────────────────────────────

  public shared ({ caller }) func setFounderPhoto(hash : Blob) : async () {
    founderPhotoHash := ?hash;
  };

  public shared ({ caller }) func removeFounderPhoto() : async () {
    founderPhotoHash := null;
  };

  public query ({ caller }) func getFounderPhotoHash() : async ?Blob {
    founderPhotoHash;
  };

  // ─── Admin Settings (Persistent Key-Value Store) ──────────────────────────
  // Stores all admin panel data permanently on-chain as JSON strings.
  // Keys: e.g. "adminConfig", "homepageSettings", "musicSongs",
  //       "jobListings", "contactInfo", "panServices", etc.

  public shared ({ caller }) func setAdminSetting(key : Text, value : Text) : async () {
    adminSettings.add(key, value);
  };

  public query func getAdminSetting(key : Text) : async ?Text {
    adminSettings.get(key);
  };

  public query func getAllAdminSettings() : async [(Text, Text)] {
    adminSettings.entries().toArray();
  };

  public shared ({ caller }) func deleteAdminSetting(key : Text) : async () {
    adminSettings.remove(key);
  };

};
