import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '../invoice-generation-engine/invoiceStore';
import type{ Invoice } from 'shared-types';
import { BillingItemType,InvoiceStatus } from 'shared-types';

const InvoiceManagement: React.FC = () => {
  const {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice
  } = useInvoiceStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{
      description: '',
      quantity: 1,
      unitPrice: 0,
      type: BillingItemType.WORKSPACE
    }]
  });

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * 0.17;
    const total = subtotal + taxAmount;

    const now = new Date().toISOString();

const invoiceData = {
  invoice_number: 'INV-' + Date.now(),
  customer_id: formData.customerId,
  customer_name: '  לדוגמה', 
  issue_date: formData.issueDate,
  due_date: formData.dueDate,
  subtotal,
  tax_amount: taxAmount,
  tax_total: taxAmount, // ייתכן ששני השדות הללו מיותרים — תבחרי אחד לפי המודל
  status: InvoiceStatus.DRAFT,
  items: formData.items.map((item, index) => ({
    id: `item-${index}`,
    invoice_id: '', // יתמלא אוטומטית אחרי שמכניסים את החשבונית, או לשים null
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice, // תיקון שם!
    total_price: item.quantity * item.unitPrice,
    tax_rate: 0.17,
    tax_amount: item.quantity * item.unitPrice * 0.17,
    type: item.type,
    createdAt: now,
    updatedAt: now,
  })),
};


    // await createInvoice(invoiceData);
    setShowForm(false);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unitPrice: 0,
        type: BillingItemType.WORKSPACE
      }]
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  if (loading) return <div>טוען...</div>;

  return (
    <div>
      <h1>ניהול חשבוניות</h1>
      
      <button onClick={() => setShowForm(true)}>
        חשבונית חדשה
      </button>

      {error && <div>שגיאה: {error}</div>}

      {/* טופס יצירת חשבונית */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>חשבונית חדשה</h2>
          
          <input
            type="text"
            placeholder="מזהה לקוח"
            value={formData.customerId}
            onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
            required
          />

          <input
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
            required
          />

          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          />

          <h3>פריטים</h3>
          {formData.items.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="תיאור"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                required
              />
              
              <input
                type="number"
                placeholder="כמות"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                required
              />
              
              <input
                type="number"
                placeholder="מחיר יחידה"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                required
              />

              <select
                value={item.type}
                onChange={(e) => updateItem(index, 'type', e.target.value)}
              >
                <option value={BillingItemType.WORKSPACE}>השכרת עמדה</option>
                <option value={BillingItemType.MEETING_ROOM}>חדר ישיבות</option>
                <option value={BillingItemType.SERVICE}>משרד פרטי</option>
                <option value={BillingItemType.OTHER}>אחר</option>
              </select>
            </div>
          ))}

          <button type="button" onClick={addItem}>הוסף פריט</button>
          
          <button type="submit">צור חשבונית</button>
          <button type="button" onClick={() => setShowForm(false)}>ביטול</button>
        </form>
      )}

      {/* רשימת חשבוניות */}
      <table>
        <thead>
          <tr>
            <th>מספר חשבונית</th>
            <th>לקוח</th>
            <th>תאריך</th>
            <th>סכום</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: Invoice) => (
  <tr key={invoice.id}>
    <td>{invoice.invoice_number}</td>
    <td>{invoice.customer_id}</td>
    <td>{invoice.issue_date}</td>
    <td>{invoice.subtotal}</td>
    <td>
      <select
        value={invoice.status}
        onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value as InvoiceStatus)}
      >
        <option value={InvoiceStatus.DRAFT}>טיוטה</option>
        <option value={InvoiceStatus.SENT}>נשלח</option>
        <option value={InvoiceStatus.PAID}>שולם</option>
        <option value={InvoiceStatus.OVERDUE}>באיחור</option>
        <option value={InvoiceStatus.CANCELED}>בוטל</option>
      </select>
    </td>
    <td>
      <button onClick={() => deleteInvoice(invoice.id)}>מחק</button>
    </td>
  </tr>
))}    
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceManagement;