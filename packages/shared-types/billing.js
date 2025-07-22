// billing-types.d.ts
// Invoice status enum
export var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "DRAFT";
    InvoiceStatus["ISSUED"] = "ISSUED";
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    InvoiceStatus["OVERDUE"] = "OVERDUE";
    InvoiceStatus["CANCELED"] = "CANCELED";
    ///ע"פ הדוגמה צריך להוריד את sent
    InvoiceStatus["SENT"] = "SENT";
})(InvoiceStatus || (InvoiceStatus = {}));
// Payment method enum
export var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethodType["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethodType["CHECK"] = "CHECK";
    PaymentMethodType["CASH"] = "CASH";
    PaymentMethodType["OTHER"] = "OTHER";
})(PaymentMethodType || (PaymentMethodType = {}));
// Billing item type enum
export var BillingItemType;
(function (BillingItemType) {
    BillingItemType["WORKSPACE"] = "WORKSPACE";
    BillingItemType["MEETING_ROOM"] = "MEETING_ROOM";
    BillingItemType["LOUNGE"] = "LOUNGE";
    BillingItemType["SERVICE"] = "SERVICE";
    BillingItemType["DISCOUNT"] = "DISCOUNT";
    BillingItemType["OTHER"] = "OTHER";
})(BillingItemType || (BillingItemType = {}));
// Payment status enum
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELED"] = "CANCELED";
})(PaymentStatus || (PaymentStatus = {}));
