import { Route, Routes } from "react-router-dom";
import { Billing } from "./billing";
import { CreateInvoiceButtons } from "./creatingInvoices/billingButton";

export const BillingRouting = () => (
  <Routes>
    <Route path="/" element={<Billing />}>
      <Route path="createInvoice" element={<CreateInvoiceButtons />} />
    </Route>
  </Routes>
);