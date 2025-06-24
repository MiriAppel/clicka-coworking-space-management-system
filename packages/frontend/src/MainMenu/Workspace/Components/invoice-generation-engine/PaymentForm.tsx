//ייבוא
import React, { useEffect, useState } from 'react';
import { useInvoiceStore } from '../invoice-generation-engine/invoiceStore';
import { usePaymentStore } from '../invoice-generation-engine/paymentStore';
import axios from 'axios';
import { InvoiceStatus, PaymentMethodType } from 'shared-types';
//פונקצייה לשלליחת תשלום לשרת
async function sendPaymentToApi(payment: any) {
  try {
    const response = await axios.post('http://localhost:3000/payments', payment);
    return response.data;
  } catch (error) {
    console.error('שגיאה בשליחת תשלום לשרת:', error);
    throw error;
  }
}

export default function PaymentForm() {
    //סטייטים לשמירת ערכי השדות
    const [method, setMethod] = useState('cash');
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [invoiceId, setInvoiceId] = useState('');
    const { invoices, fetchInvoices, updateInvoiceStatus } = useInvoiceStore();
    const { payments, addPayment } = usePaymentStore();
//קבלת חשבוניוצ ותשלומים מהstor
    useEffect(() => {
        fetchInvoices();
    }, []);
//פונקציה שליחת הטופס 
//בודקת שנבחרה חשבונית
//מחשבת כמה שולם ומה נשאר
//בודקת שלא משלמים יותר מהיתרה
//בונה אובייקט תששלום חדש
//שולחת לAPI
//מוסיפה תשלום
//מעדכנת סטטוס
//מאפסת את השדות של הסכןם
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!invoiceId) return;

    const invoice = invoices.find(inv => inv.id === invoiceId);
    const paid = payments.filter(p => p.invoice_id === invoiceId).reduce((sum, p) => sum + p.amount, 0);
    const remaining = invoice ? invoice.subtotal - paid : 0;

    if (Number(amount) > remaining) {
        alert('לא ניתן לשלם יותר מהיתרה!');
        return;
    }

    const paymentObj = {
        id: Math.random().toString(36).substr(2, 9),
        customer_id: invoice?.customer_id || '',
        customer_name: invoice?.customer_name || '',
        invoice_id: invoiceId,
        amount: Number(amount),
        method: method as PaymentMethodType,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transaction_reference: reference || '',
    };

    // שליחה לשרת
    await sendPaymentToApi(paymentObj);

    // המשך לוקאלי (אם צריך)
    addPayment(paymentObj);

    // עדכון סטטוס אם צריך
    const paidAfter = paid + Number(amount);
    const remainingAfter = invoice ? invoice.subtotal - paidAfter : 0;
    if (invoice && remainingAfter === 0) {
        updateInvoiceStatus(invoiceId, InvoiceStatus.PAID);
    }

    setAmount('');
    setReference('');
};
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
           {/* //לבחור שיטת תשלום */}
            <label>
                שיטת תשלום:
                <select value={method} onChange={e => setMethod(e.target.value)}>
                    <option value={PaymentMethodType.CASH}>מזומן</option>
                    <option value={PaymentMethodType.CREDIT_CARD}>כרטיס אשראי</option>
                    <option value={PaymentMethodType.BANK_TRANSFER}>העברה בנקאית</option>
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
{/* //קולט מזהה/הערה  */}
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
{/*   את הצגת הסטטוס */}
{invoiceId && (
  <div style={{ margin: '8px 0', fontWeight: 'bold' }}>
    סטטוס חשבונית: {invoices.find(inv => inv.id === invoiceId)?.status}
  </div>
)}
            {invoiceId && (
                <div style={{ margin: '16px 0' }}>
                    <h4>תשלומים לחשבונית:</h4>
                    {payments.filter(p => p.invoice_id === invoiceId).length === 0 && (
                        <div>אין תשלומים לחשבונית זו.</div>
                    )}
                    {payments.filter(p => p.invoice_id === invoiceId).map(p => (
                        <div key={p.id}>
                            {p.amount} ש"ח - {p.method} - {new Date(p.date).toLocaleDateString()}
                        </div>
                    ))}
                    {/* חישוב יתרה */}
                    {(() => {
                        const invoice = invoices.find(inv => inv.id === invoiceId);
                        const paid = payments.filter(p => p.invoice_id === invoiceId).reduce((sum, p) => sum + p.amount, 0);
                        const remaining = invoice ? invoice.subtotal - paid : 0;
                        if (Number(amount) > remaining) {
                            alert('לא ניתן לשלם יותר מהיתרה!');
                            return;
                        }
                        return invoice ? (
                            <div style={{ marginTop: 8 }}>
                                <b>יתרה לתשלום:</b> {remaining} ש"ח
                            </div>
                        ) : null;
                    })()}
                </div>
            )}

            <button type="submit">רשום תשלום</button>
        </form>
    );
}