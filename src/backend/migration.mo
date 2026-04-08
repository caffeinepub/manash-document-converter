import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // ── Old types (inlined from .old stable signature) ──────────────────────

  type OldUserRole = { #admin; #guest; #user };

  type OldAccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, OldUserRole>;
  };

  type OldStripeConfiguration = {
    allowedCountries : [Text];
    secretKey : Text;
  };

  // ── New types ────────────────────────────────────────────────────────────

  type NewStripeConfiguration = {
    secretKey : Text;
    publishableKey : Text;
  };

  // ── Migration domain / codomain ──────────────────────────────────────────

  type OldActor = {
    accessControlState : OldAccessControlState;
    var stripeConfig : ?OldStripeConfiguration;
  };

  type NewActor = {
    var stripeConfig : ?NewStripeConfiguration;
  };

  // ── Migration function ───────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // accessControlState is intentionally dropped (frontend uses password auth)
    // stripeConfig: old type had allowedCountries+secretKey, new has secretKey+publishableKey
    let newStripeConfig : ?NewStripeConfiguration = switch (old.stripeConfig) {
      case (null) { null };
      case (?oldConfig) {
        ?{ secretKey = oldConfig.secretKey; publishableKey = "" };
      };
    };
    { var stripeConfig = newStripeConfig };
  };
};
