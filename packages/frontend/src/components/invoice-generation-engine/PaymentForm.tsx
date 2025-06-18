import React, { useEffect, useState } from 'react';
import{useInvoiceStore} from '../invoice-generation-engine/invoiceStore';
import { usePaymentStore } from '../invoice-generation-engine/paymentStore';
export default function PaymentForm() {
  const [method, setMethod] = useState('cash');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const { invoices, fetchInvoices } = useInvoiceStore();
  const { payments } = usePaymentStore();

     useEffect(() => {
    fetchInvoices();
  }, []);
  // בהמשך נוסיף כאן את השגת החשבוניות מהסטור

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // כאן נטפל בשליחת הטופס
    alert('טופס נשלח (דמו)');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <label>
        שיטת תשלום:
        <select value={method} onChange={e => setMethod(e.target.value)}>
          <option value="cash">מזומן</option>
          <option value="card">כרטיס אשראי</option>
          <option value="bank">העברה בנקאית</option>
        </select>
      </label>

      <label>
        סכום:
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </label>

      <label>
        רפרנס:
        <input
          type="text"
          value={reference}
          onChange={e => setReference(e.target.value)}
        />
      </label>

      <label>
  חשבונית:
  <select value={invoiceId} onChange={e => setInvoiceId(e.target.value)} required>
    <option value="">בחר חשבונית</option>
    {invoices.map(inv => (
      <option key={inv.id} value={inv.id}>
        {inv.invoice_number} - {inv.customer_name}
      </option>
    ))}
  </select>
</label>

      <button type="submit">רשום תשלום</button>
    </form>
  );
}