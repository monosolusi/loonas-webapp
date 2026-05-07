// In v1 only PENDING_PAYMENT and PAID emit on the wire. PENDING_CREATION is a
// transient internal state, FAILED and EXPIRED are reserved for ENG-33. Listing
// all five keeps the enum aligned with the BE schema and lets the FE default-
// handle unexpected values as terminal-not-paid.
export enum PayInDetailStatus {
  PENDING_CREATION = "PENDING_CREATION",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAID = "PAID",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
}
