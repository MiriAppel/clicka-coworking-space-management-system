"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTerms = exports.VendorCategory = exports.VendorStatus = exports.PaymentMethod = exports.ExpensePaymentMethod = exports.ExpenseStatus = exports.ExpenseCategory = void 0;
// Expense category enum
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["RENT"] = "RENT";
    ExpenseCategory["UTILITIES"] = "UTILITIES";
    ExpenseCategory["CLEANING"] = "CLEANING";
    ExpenseCategory["MAINTENANCE"] = "MAINTENANCE";
    ExpenseCategory["OFFICE_SUPPLIES"] = "OFFICE_SUPPLIES";
    ExpenseCategory["REFRESHMENTS"] = "REFRESHMENTS";
    ExpenseCategory["MARKETING"] = "MARKETING";
    ExpenseCategory["SALARIES"] = "SALARIES";
    ExpenseCategory["INSURANCE"] = "INSURANCE";
    ExpenseCategory["SOFTWARE"] = "SOFTWARE";
    ExpenseCategory["PROFESSIONAL_SERVICES"] = "PROFESSIONAL_SERVICES";
    ExpenseCategory["TAXES"] = "TAXES";
    ExpenseCategory["EVENTS"] = "EVENTS";
    ExpenseCategory["FURNITURE"] = "FURNITURE";
    ExpenseCategory["EQUIPMENT"] = "EQUIPMENT";
    ExpenseCategory["PETTY_CASH"] = "PETTY_CASH";
    ExpenseCategory["OTHER"] = "OTHER";
})(ExpenseCategory || (exports.ExpenseCategory = ExpenseCategory = {}));
// Expense status enum
var ExpenseStatus;
(function (ExpenseStatus) {
    ExpenseStatus["PENDING"] = "PENDING";
    ExpenseStatus["APPROVED"] = "APPROVED";
    ExpenseStatus["PAID"] = "PAID";
    ExpenseStatus["REJECTED"] = "REJECTED";
})(ExpenseStatus || (exports.ExpenseStatus = ExpenseStatus = {}));
// Payment method (for expenses)
var ExpensePaymentMethod;
(function (ExpensePaymentMethod) {
    ExpensePaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    ExpensePaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    ExpensePaymentMethod["CHECK"] = "CHECK";
    ExpensePaymentMethod["CASH"] = "CASH";
    ExpensePaymentMethod["PETTY_CASH"] = "PETTY_CASH";
    ExpensePaymentMethod["OTHER"] = "OTHER";
})(ExpensePaymentMethod || (exports.ExpensePaymentMethod = ExpensePaymentMethod = {}));
// export enum PaymentMethod {
//   BankTransfer = 'BankTransfer',   
//   CreditCard = 'CreditCard',      
//   Cash = 'Cash',                  
//   Other = 'Other'                 
// }
// export enum VendorStatus {
//   Active = 'Active',
//   Inactive = 'Inactive',
//   Suspended = 'Suspended'
// }
// export enum VendorCategory {
//   Equipment = 'Equipment',
//   Services = 'Services',
//   Maintenance = 'Maintenance',
//   Other = 'Other'
// }
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["BankTransfer"] = "BankTransfer";
    PaymentMethod["CreditCard"] = "CreditCard";
    PaymentMethod["Cash"] = "Cash";
    PaymentMethod["Other"] = "Other";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var VendorStatus;
(function (VendorStatus) {
    VendorStatus["Active"] = "Active";
    VendorStatus["Inactive"] = "Inactive";
    VendorStatus["Suspended"] = "Suspended";
})(VendorStatus || (exports.VendorStatus = VendorStatus = {}));
var VendorCategory;
(function (VendorCategory) {
    VendorCategory["Equipment"] = "Equipment";
    VendorCategory["Services"] = "Services";
    VendorCategory["Maintenance"] = "Maintenance";
    VendorCategory["Other"] = "Other";
})(VendorCategory || (exports.VendorCategory = VendorCategory = {}));
var PaymentTerms;
(function (PaymentTerms) {
    PaymentTerms["NET_15"] = "Net 15";
    PaymentTerms["NET_30"] = "Net 30";
    PaymentTerms["EOM"] = "End of Month";
    PaymentTerms["COD"] = "Cash on Delivery";
})(PaymentTerms || (exports.PaymentTerms = PaymentTerms = {}));
