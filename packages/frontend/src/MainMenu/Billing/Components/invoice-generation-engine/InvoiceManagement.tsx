// // // import React, { useState, useEffect } from 'react';
// // // import { useInvoiceStore } from '../../../../Stores/Billing/invoiceStore';
// // // import { InvoiceStatus, BillingItemType, CreateInvoiceRequest } from 'shared-types';
// // // import { Table, TableColumn } from '../../../Common/Components/BaseComponents/Table';
// // // import { Button } from '../../../Common/Components/BaseComponents/Button';
// // // // מחלקה שמכילה הצהרה ומימוש פונקציות לניהול החשבוניות
// // // export const InvoiceManagement: React.FC = () => {
// // //     const {
// // //         invoices,
// // //         loading,
// // //         error,
// // //         getAllInvoices,
// // //         createInvoice,
// // //         updateInvoice,
// // //         updateInvoiceStatus,
// // //         deleteInvoice,
// // //         generateMonthlyInvoices,
// // //         sendInvoiceByEmail,
// // //         getOverdueInvoices,
// // //         getInvoicesByStatus,
// // //         calculateOpenInvoicesTotal,
// // //         clearError
// // //     } = useInvoiceStore();

// // //     const [showForm, setShowForm] = useState(false);
// // //     const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(InvoiceStatus.DRAFT);
// // //     const [emailData, setEmailData] = useState({ invoiceId: '', email: '' });

// // // const [formData, setFormData] = useState({
// // //     customerId: '',
// // //     customerName: '', // הוסף שדה חדש
// // //     issueDate: new Date().toISOString().split('T')[0],
// // //     dueDate: '',
// // //     items: [{
// // //         description: '',
// // //         quantity: 1,
// // //         unitPrice: 0,
// // //         type: BillingItemType.WORKSPACE
// // //     }]
// // // });

// // // useEffect(() => {
// // //     console.log(' קומפוננטה נטענת - מתחיל לשלוף חשבוניות');
// // //     getAllInvoices();
// // // }, [getAllInvoices]);

// // // // הוסיפי useEffect נוסף לבדיקת שינויים ב-invoices
// // // useEffect(() => {
// // //     console.log(' invoices השתנה:', invoices);
// // //     console.log(' סוג:', typeof invoices);
// // //     console.log(' האם מערך?', Array.isArray(invoices));
// // //     console.log(' כמות:', invoices?.length || 0);
// // //        if (invoices && invoices.length > 0) {
// // //         console.log('שדות החשבונית הראשונה:', Object.keys(invoices[0]));
// // //         console.log('החשבונית הראשונה המלאה:', invoices[0]);
// // //     }
// // // }, [invoices]);

// // //     // הגדרת עמודות הטבלה
// // // const columns: TableColumn<any>[] = [
// // //     { header: 'מספר חשבונית', accessor: 'invoice_number' },
// // //     { header: 'שם לקוח', accessor: 'customer_name' },
// // //     { header: 'סטטוס', accessor: 'status' },
// // //     { header: 'תאריך הנפקה', accessor: 'issue_date' },
// // //     { header: 'תאריך פירעון', accessor: 'due_date' },
// // //     { header: 'פרטי חיוב', accessor: 'items' },
// // //     { header: 'סכום ביניים', accessor: 'subtotal' },
// // //     { header: 'מס', accessor: 'tax_total' },
// // //     { header: 'תזכורת לתשלום נשלחה בתאריך', accessor: 'payment_due_reminder_sent_at' },
// // //     { header: 'נוצר בתאריך', accessor: 'created_at' },
// // //     { header: 'עודכן בתאריך', accessor: 'updated_at' },
// // //     { header: 'פעולות', accessor: 'actions' }
// // // ];
// // //     // עיבוד הנתונים לטבלה
// // // // עיבוד הנתונים לטבלה
// // // const tableData = (invoices && Array.isArray(invoices) ? invoices : []).map((invoice, index) => {
// // //     // הוסיפי לוג כדי לראות את המבנה של החשבונית
// // //     console.log('מבנה החשבונית:', invoice);

// // //     return {
// // //         ...invoice,
// // //         items: invoice.items && invoice.items.length > 0 ? (
// // //             <div>
// // //                 {invoice.items.map((item, itemIndex) => (
// // //                     <div key={itemIndex}>
// // //                         <div>ID: {item.id}</div>
// // //                         <div>Invoice ID: {item.invoice_id}</div>
// // //                         <div>תיאור: {item.description}</div>
// // //                         <div>סוג: {item.type}</div>
// // //                         <div>כמות: {item.quantity}</div>
// // //                         <div>מחיר יחידה: ₪{item.unit_price}</div>
// // //                         <div>מחיר כולל: ₪{item.total_price}</div>
// // //                         <div>שיעור מס: {item.tax_rate}%</div>
// // //                         <div>סכום מס: ₪{item.tax_amount}</div>
// // //                         {item.workspace_type && <div>סוג workspace: {item.workspace_type}</div>}
// // //                         {item.booking_id && <div>Booking ID: {item.booking_id}</div>}
// // //                         <div>נוצר: {item.createdAt}</div>
// // //                         <div>עודכן: {item.updatedAt}</div>
// // //                     </div>
// // //                 ))}
// // //             </div>
// // //         ) : (
// // //             <span>אין פריטים</span>
// // //         ),
// // //         actions: (
// // //             <Button onClick={() => {
// // //                 console.log('לחיצה על מחיקה - מבנה החשבונית:', invoice);
// // //                 console.log('ID:', invoice.id);
// // //                 console.log('Invoice Number:', invoice.invoice_number);
// // //                 // השתמש ב-id במקום invoice_number
// // //                 handleDelete(invoice.id || invoice.invoice_number);
// // //             }}>
// // //                 מחק
// // //             </Button>
// // //         )
// // //     };
// // // });

// // //     // איפוס הטופס
// // // const resetForm = () => {
// // //     setFormData({
// // //         customerId: '',
// // //         customerName: '', // הוסף את השדה החדש
// // //         issueDate: new Date().toISOString().split('T')[0],
// // //         dueDate: '',
// // //         items: [{
// // //             description: '',
// // //             quantity: 1,
// // //             unitPrice: 0,
// // //             type: BillingItemType.WORKSPACE
// // //         }]
// // //     });
// // //     setShowForm(false);
// // // };

// // // const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
// // //     const taxAmount = subtotal * 0.17;

// // //     // יצירת אובייקט התואם לממשק Invoice
// // //       const invoiceData: CreateInvoiceRequest = {
// // //         customerId: formData.customerId,
// // //         issueDate: formData.issueDate,
// // //         dueDate: formData.dueDate,
// // //         items: formData.items.map((item) => ({
// // //             type: item.type,
// // //             description: item.description,
// // //             quantity: item.quantity,
// // //             unitPrice: item.unitPrice,
// // //             taxRate: 17,
// // //             // workspaceType: אופציונלי
// // //             // bookingId: אופציונלי
// // //         })),
// // //         notes: '' // אופציונלי
// // //     };

// // //     try {
// // //         await createInvoice(invoiceData);
// // //         resetForm();
// // //     } catch (error) {
// // //         console.error('שגיאה ביצירת חשבונית:', error);
// // //     }
// // // };


// // //     // הוספת פריט חדש לחשבונית
// // //     const addItem = () => {
// // //         setFormData(prev => ({
// // //             ...prev,
// // //             items: [...prev.items, {
// // //                 description: '',
// // //                 quantity: 1,
// // //                 unitPrice: 0,
// // //                 type: BillingItemType.WORKSPACE
// // //             }]
// // //         }));
// // //     };

// // //     // עדכון פריט בחשבונית
// // //     const updateItem = (index: number, field: string, value: any) => {
// // //         setFormData(prev => ({
// // //             ...prev,
// // //             items: prev.items.map((item, i) =>
// // //                 i === index ? { ...item, [field]: value } : item
// // //             )
// // //         }));
// // //     };

// // //     // הסרת פריט מהחשבונית
// // //     const removeItem = (index: number) => {
// // //         if (formData.items.length > 1) {
// // //             setFormData(prev => ({
// // //                 ...prev,
// // //                 items: prev.items.filter((_, i) => i !== index)
// // //             }));
// // //         }
// // //     };

// // //     // יצירת חשבוניות חודשיות
// // //     const handleGenerateMonthly = async () => {
// // //         try {
// // //             await generateMonthlyInvoices();
// // //         } catch (error) {
// // //             console.error('שגיאה ביצירת חשבוניות חודשיות:', error);
// // //         }
// // //     };

// // //     // שליחת חשבונית במייל
// // //     const handleSendEmail = async () => {
// // //         if (!emailData.invoiceId || !emailData.email) return;

// // //         try {
// // //             await sendInvoiceByEmail(emailData.invoiceId, emailData.email);
// // //             setEmailData({ invoiceId: '', email: '' });
// // //         } catch (error) {
// // //             console.error('שגיאה בשליחת מייל:', error);
// // //         }
// // //     };

// // //     // עדכון סטטוס חשבונית
// // //     const handleStatusUpdate = async (invoiceId: string, status: InvoiceStatus) => {
// // //         try {
// // //             await updateInvoiceStatus(invoiceId, status);
// // //         } catch (error) {
// // //             console.error('שגיאה בעדכון סטטוס:', error);
// // //         }
// // //     };

// // // // מחיקת חשבונית
// // // const handleDelete = async (invoice_number: string) => {
// // //     console.log('מתחיל מחיקה של חשבונית:', invoice_number);
// // //     console.log('סוג המזהה:', typeof invoice_number);

// // //     // הוסף אישור למחיקה
// // //     if (!window.confirm(`האם אתה בטוח שברצונך למחוק את החשבונית ${invoice_number}?`)) {
// // //         return;
// // //     }

// // //     try {
// // //         await deleteInvoice(invoice_number);
// // //         console.log('חשבונית נמחקה בהצלחה');
// // //     } catch (error) {
// // //         console.error('שגיאה במחיקת חשבונית:', error);
// // //     }
// // // };

// // //     /////////////////////////////////////////////////
// // // return (
// // //     <div className="invoice-management" >

// // //         <h1>ניהול חשבוניות</h1>
// // //         <br />
// // //         {error && (
// // //             <div>
// // //                 שגיאה: {error}
// // //                 <Button onClick={clearError} >✕</Button>
// // //             </div>
// // //         )}
// // //         {/* כפתורי פעולות ראשיים */}
// // //         <div>
// // //             <Button
// // //                 onClick={() => setShowForm(!showForm)}
// // //             >
// // //                 {showForm ? 'ביטול' : 'יצירת חשבונית חדשה'}
// // //             </Button>
// // //             <Button
// // //                 onClick={handleGenerateMonthly}
// // //             >
// // //                 יצירת חשבוניות חודשיות
// // //             </Button>
// // //         </div>

// // //         {/* הוסף את הטופס כאן */}
// // //         {showForm && (
// // //             <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
// // //                 <h3>יצירת חשבונית חדשה</h3>
// // //                 <form onSubmit={handleSubmit}>
// // //                     <div style={{ marginBottom: '12px' }}>
// // //                         <label>מזהה לקוח:</label>
// // //                         <input
// // //                             type="text"
// // //                             value={formData.customerId}
// // //                             onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
// // //                             style={{ width: '100%', padding: '8px', marginTop: '4px' }}
// // //                             required
// // //                         />
// // //                     </div>
// // //                     <div style={{ marginBottom: '12px' }}>
// // //                         <label>שם לקוח:</label>
// // //                         <input
// // //                             type="text"
// // //                             value={formData.customerName}
// // //                             onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
// // //                             style={{ width: '100%', padding: '8px', marginTop: '4px' }}
// // //                             required
// // //                         />
// // //                     </div>
// // //                     <div style={{ marginBottom: '12px' }}>
// // //                         <label>תאריך הנפקה:</label>
// // //                         <input
// // //                             type="date"
// // //                             value={formData.issueDate}
// // //                             onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
// // //                             style={{ width: '100%', padding: '8px', marginTop: '4px' }}
// // //                             required
// // //                         />
// // //                     </div>
// // //                     <div style={{ marginBottom: '12px' }}>
// // //                         <label>תאריך פירעון:</label>
// // //                         <input
// // //                             type="date"
// // //                             value={formData.dueDate}
// // //                             onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
// // //                             style={{ width: '100%', padding: '8px', marginTop: '4px' }}
// // //                             required
// // //                         />
// // //                     </div>

// // //                     {/* פריטי החשבונית */}
// // //                     <div style={{ marginBottom: '16px' }}>
// // //                         <h4>פריטי החשבונית</h4>
// // //                         {formData.items.map((item, index) => (
// // //                             <div key={index} style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '8px', borderRadius: '4px' }}>
// // //                                 <div style={{ marginBottom: '8px' }}>
// // //                                     <label>תיאור:</label>
// // //                                     <input
// // //                                         type="text"
// // //                                         value={item.description}
// // //                                         onChange={(e) => updateItem(index, 'description', e.target.value)}
// // //                                         style={{ width: '100%', padding: '4px', marginTop: '2px' }}
// // //                                         required
// // //                                     />
// // //                                 </div>
// // //                                 <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
// // //                                     <div style={{ flex: 1 }}>
// // //                                         <label>כמות:</label>
// // //                                         <input
// // //                                             type="number"
// // //                                             value={item.quantity}
// // //                                             onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
// // //                                             style={{ width: '100%', padding: '4px', marginTop: '2px' }}
// // //                                             min="1"
// // //                                             required
// // //                                         />
// // //                                     </div>
// // //                                     <div style={{ flex: 1 }}>
// // //                                         <label>מחיר יחידה:</label>
// // //                                         <input
// // //                                             type="number"
// // //                                             value={item.unitPrice}
// // //                                             onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
// // //                                             style={{ width: '100%', padding: '4px', marginTop: '2px' }}
// // //                                             min="0"
// // //                                             step="0.01"
// // //                                             required
// // //                                         />
// // //                                     </div>
// // //                                 </div>
// // //                                 <div style={{ marginBottom: '8px' }}>
// // //                                     <label>סוג:</label>
// // //                                     <select
// // //                                         value={item.type}
// // //                                         onChange={(e) => updateItem(index, 'type', e.target.value)}
// // //                                         style={{ width: '100%', padding: '4px', marginTop: '2px' }}
// // //                                     >
// // //                                         <option value={BillingItemType.WORKSPACE}>Workspace</option>
// // //                                         <option value={BillingItemType.MEETING_ROOM}>Meeting Room</option>
// // //                                         <option value={BillingItemType.LOUNGE}>Lounge</option>
// // //                                         <option value={BillingItemType.SERVICE}>Service</option>
// // //                                         <option value={BillingItemType.DISCOUNT}>Discount</option>
// // //                                         <option value={BillingItemType.OTHER}>Other</option>
// // //                                     </select>
// // //                                 </div>
// // //                                 {formData.items.length > 1 && (
// // //                                     <Button
// // //                                         type="button"
// // //                                         onClick={() => removeItem(index)}
// // //                                         style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
// // //                                     >
// // //                                         הסר פריט
// // //                                     </Button>
// // //                                 )}
// // //                             </div>
// // //                         ))}
// // //                         <Button
// // //                             type="button"
// // //                             onClick={addItem}
// // //                             style={{ backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
// // //                         >
// // //                             הוסף פריט
// // //                         </Button>
// // //                     </div>

// // //                     <div style={{ marginBottom: '16px' }}>
// // //                         <Button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
// // //                             צור חשבונית
// // //                         </Button>
// // //                     </div>
// // //                 </form>
// // //             </div>
// // //         )}

// // // <div>

// // //     <h3>רשימת חשבוניות ({invoices && Array.isArray(invoices) ? invoices.length : 0})</h3>
// // //     <div>
// // //         <Table
// // //             columns={columns}
// // //             data={tableData}
// // //         />
// // //     </div>
// // // </div>
// // //     </div>
// // // );

// // // };
// // // export default InvoiceManagement;




// // //2
// // import React, { useState, useEffect } from 'react';
// // import { useInvoiceStore } from '../../../../Stores/Billing/invoiceStore';
// // import { InvoiceStatus, BillingItemType, CreateInvoiceRequest } from 'shared-types';
// // import { Table, TableColumn } from '../../../Common/Components/BaseComponents/Table';
// // import { Button } from '../../../Common/Components/BaseComponents/Button';

// // // מחלקה שמכילה הצהרה ומימוש פונקציות לניהול החשבוניות
// // export const InvoiceManagement: React.FC = () => {
// //     const {
// //         invoices,
// //         loading,
// //         error,
// //         getAllInvoices,
// //         createInvoice,
// //         updateInvoice,
// //         updateInvoiceStatus,
// //         deleteInvoice,
// //         generateMonthlyInvoices,
// //         sendInvoiceByEmail,
// //         getOverdueInvoices,
// //         getInvoicesByStatus,
// //         calculateOpenInvoicesTotal,
// //         clearError
// //     } = useInvoiceStore();

// //     const [showForm, setShowForm] = useState(false);
// //     const [editingInvoice, setEditingInvoice] = useState<any>(null); // חשבונית שנערכת
// //     const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(InvoiceStatus.DRAFT);
// //     const [emailData, setEmailData] = useState({ invoiceId: '', email: '' });

// //     const [formData, setFormData] = useState({
// //         customerId: '',
// //         customerName: '',
// //         issueDate: new Date().toISOString().split('T')[0],
// //         dueDate: '',
// //         items: [{
// //             description: '',
// //             quantity: 1,
// //             unitPrice: 0,
// //             type: BillingItemType.WORKSPACE
// //         }]
// //     });

// //     useEffect(() => {
// //         console.log(' קומפוננטה נטענת - מתחיל לשלוף חשבוניות');
// //         getAllInvoices();
// //     }, [getAllInvoices]);

// //     useEffect(() => {
// //         console.log(' invoices השתנה:', invoices);
// //         console.log(' סוג:', typeof invoices);
// //         console.log(' האם מערך?', Array.isArray(invoices));
// //         console.log(' כמות:', invoices?.length || 0);
// //         if (invoices && invoices.length > 0) {
// //             console.log('שדות החשבונית הראשונה:', Object.keys(invoices[0]));
// //             console.log('החשבונית הראשונה המלאה:', invoices[0]);
// //         }
// //     }, [invoices]);

// //     // הגדרת עמודות הטבלה
// //     const columns: TableColumn<any>[] = [
// //         { header: 'מספר חשבונית', accessor: 'invoice_number' },
// //         { header: 'שם לקוח', accessor: 'customer_name' },
// //         { header: 'סטטוס', accessor: 'status' },
// //         { header: 'תאריך הנפקה', accessor: 'issue_date' },
// //         { header: 'תאריך פירעון', accessor: 'due_date' },
// //         { header: 'פרטי חיוב', accessor: 'items' },
// //         { header: 'סכום ביניים', accessor: 'subtotal' },
// //         { header: 'מס', accessor: 'tax_total' },
// //         { header: 'תזכורת לתשלום נשלחה בתאריך', accessor: 'payment_due_reminder_sent_at' },
// //         { header: 'נוצר בתאריך', accessor: 'created_at' },
// //         { header: 'עודכן בתאריך', accessor: 'updated_at' },
// //         { header: 'פעולות', accessor: 'actions' }
// //     ];

// //     // עיבוד הנתונים לטבלה
// //     const tableData = (invoices && Array.isArray(invoices) ? invoices : []).map((invoice, index) => {
// //         console.log('מבנה החשבונית:', invoice);

// //         return {
// //             ...invoice,
// //             items: invoice.items && invoice.items.length > 0 ? (
// //                 <div>
// //                     {invoice.items.map((item, itemIndex) => (
// //                         <div key={itemIndex}>
// //                             <div>ID: {item.id}</div>
// //                             <div>Invoice ID: {item.invoice_id}</div>
// //                             <div>תיאור: {item.description}</div>
// //                             <div>סוג: {item.type}</div>
// //                             <div>כמות: {item.quantity}</div>
// //                             <div>מחיר יחידה: ₪{item.unit_price}</div>
// //                             <div>מחיר כולל: ₪{item.total_price}</div>
// //                             <div>שיעור מס: {item.tax_rate}%</div>
// //                             <div>סכום מס: ₪{item.tax_amount}</div>
// //                             {item.workspace_type && <div>סוג workspace: {item.workspace_type}</div>}
// //                             {item.booking_id && <div>Booking ID: {item.booking_id}</div>}
// //                             <div>נוצר: {item.createdAt}</div>
// //                             <div>עודכן: {item.updatedAt}</div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             ) : (
// //                 <span>אין פריטים</span>
// //             ),
// //             actions: (
// //                 <div style={{ display: 'flex', gap: '8px' }}>
// //                     <Button
// //                         onClick={() => handleEdit(invoice)}
// //                         style={{ backgroundColor: '#2196f3', color: 'white', padding: '4px 8px', fontSize: '12px' }}
// //                     >
// //                         ערוך
// //                     </Button>
// //                     <Button
// //                         onClick={() => {
// //                             console.log('לחיצה על מחיקה - מבנה החשבונית:', invoice);
// //                             console.log('ID:', invoice.id);
// //                             console.log('Invoice Number:', invoice.invoice_number);
// //                             handleDelete(invoice.id || invoice.invoice_number);
// //                         }}
// //                         style={{ backgroundColor: '#f44336', color: 'white', padding: '4px 8px', fontSize: '12px' }}
// //                     >
// //                         מחק
// //                     </Button>
// //                 </div>
// //             )
// //         };
// //     });

// //     // פונקציה לטיפול בעריכת חשבונית
// //     const handleEdit = (invoice: any) => {
// //         console.log('מתחיל עריכה של חשבונית:', invoice);
// //         setEditingInvoice(invoice);

// //         // מילוי הטופס עם נתוני החשבונית הקיימת
// //         setFormData({
// //             customerId: invoice.customer_id || '',
// //             customerName: invoice.customer_name || '',
// //             issueDate: invoice.issue_date ? invoice.issue_date.split('T')[0] : new Date().toISOString().split('T')[0],
// //             dueDate: invoice.due_date ? invoice.due_date.split('T')[0] : '',
// //             items: invoice.items && invoice.items.length > 0 ?
// //                 invoice.items.map((item: any) => ({
// //                     description: item.description || '',
// //                     quantity: item.quantity || 1,
// //                     unitPrice: item.unit_price || 0,
// //                     type: item.type || BillingItemType.WORKSPACE
// //                 })) :
// //                 [{
// //                     description: '',
// //                     quantity: 1,
// //                     unitPrice: 0,
// //                     type: BillingItemType.WORKSPACE
// //                 }]
// //         });

// //         setShowForm(true);
// //     };

// //     // איפוס הטופס
// //     const resetForm = () => {
// //         setFormData({
// //             customerId: '',
// //             customerName: '',
// //             issueDate: new Date().toISOString().split('T')[0],
// //             dueDate: '',
// //             items: [{
// //                 description: '',
// //                 quantity: 1,
// //                 unitPrice: 0,
// //                 type: BillingItemType.WORKSPACE
// //             }]
// //         });
// //         setShowForm(false);
// //         setEditingInvoice(null); // איפוס מצב העריכה
// //     };

// //     // const handleSubmit = async (e: React.FormEvent) => {
// //     //     e.preventDefault();
// //     //     const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
// //     //     const taxAmount = subtotal * 0.17;

// //     //     try {
// //     //         if (editingInvoice) {
// //     //             // מצב עריכה - עדכון חשבונית קיימת
// //     //             const updateData: Partial<any> = {
// //     //                 customer_id: formData.customerId,
// //     //                 customer_name: formData.customerName,
// //     //                 issue_date: formData.issueDate,
// //     //                 due_date: formData.dueDate,
// //     //                 items: formData.items.map((item, index) => {
// //     //                     // אם יש פריט קיים, שמור על המאפיינים הנדרשים
// //     //                     const existingItem = editingInvoice.items?.[index];
// //     //                     return {
// //     //                         id: existingItem?.id || `temp-${Date.now()}-${index}`, // ID זמני אם אין קיים
// //     //                         invoice_id: editingInvoice.id || editingInvoice.invoice_number,
// //     //                         type: item.type,
// //     //                         description: item.description,
// //     //                         quantity: item.quantity,
// //     //                         unit_price: item.unitPrice,
// //     //                         tax_rate: 17,
// //     //                         total_price: item.quantity * item.unitPrice,
// //     //                         tax_amount: (item.quantity * item.unitPrice) * 0.17,
// //     //                         workspace_type: item.type === BillingItemType.WORKSPACE ? 'STANDARD' : undefined,
// //     //                         booking_id: existingItem?.booking_id || null,
// //     //                         createdAt: existingItem?.createdAt || new Date().toISOString(),
// //     //                         updatedAt: new Date().toISOString()
// //     //                     };
// //     //                 }),
// //     //                 subtotal: subtotal,
// //     //                 tax_total: taxAmount,
// //     //                 updatedAt: new Date().toISOString()
// //     //             };

// //     //             await updateInvoice(editingInvoice.invoice_number, updateData);
// //     //             console.log('חשבונית עודכנה בהצלחה');
// //     //         } else {
// //     //             // מצב יצירה - יצירת חשבונית חדשה
// //     //             const invoiceData: CreateInvoiceRequest = {
// //     //                 customerId: formData.customerId,
// //     //                 issueDate: formData.issueDate,
// //     //                 dueDate: formData.dueDate,
// //     //                 items: formData.items.map((item) => ({
// //     //                     type: item.type,
// //     //                     description: item.description,
// //     //                     quantity: item.quantity,
// //     //                     unitPrice: item.unitPrice,
// //     //                     taxRate: 17,
// //     //                 })),
// //     //                 notes: ''
// //     //             };

// //     //             await createInvoice(invoiceData);
// //     //             console.log('חשבונית נוצרה בהצלחה');
// //     //         }

// //     //         resetForm();
// //     //         // רענון רשימת החשבוניות
// //     //         await getAllInvoices();
// //     //     } catch (error) {
// //     //         console.error('שגיאה בטיפול בחשבונית:', error);
// //     //     }
// //     // };
// // const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
// //     const taxAmount = subtotal * 0.17;

// //     try {
// //         if (editingInvoice) {
// //             // מצב עריכה - שלח רק שדות בסיסיים
// //             const updateData = {
// //                 customer_id: formData.customerId,
// //                 customer_name: formData.customerName,
// //                 issue_date: formData.issueDate,
// //                 due_date: formData.dueDate,
// //                 subtotal: subtotal,
// //                 tax_total: taxAmount,
// //             };

// //             console.log('Frontend - Sending update data:', updateData);
// //             console.log('Frontend - Invoice number:', editingInvoice.invoice_number);

// //             await updateInvoice(editingInvoice.invoice_number, updateData);
// //             console.log('חשבונית עודכנה בהצלחה');
// //         } else {
// //             // מצב יצירה
// //             const invoiceData: CreateInvoiceRequest = {
// //                 customerId: formData.customerId,
// //                 issueDate: formData.issueDate,
// //                 dueDate: formData.dueDate,
// //                 items: formData.items.map((item) => ({
// //                     type: item.type,
// //                     description: item.description,
// //                     quantity: item.quantity,
// //                     unitPrice: item.unitPrice,
// //                     taxRate: 17,
// //                 })),
// //                 notes: ''
// //             };

// //             await createInvoice(invoiceData);
// //             console.log('חשבונית נוצרה בהצלחה');
// //         }

// //         resetForm();
// //         await getAllInvoices();
// //     } catch (error) {
// //         console.error('שגיאה בטיפול בחשבונית:', error);
// //     }
// // };


// //     // הוספת פריט חדש לחשבונית
// //     const addItem = () => {
// //         setFormData(prev => ({
// //             ...prev,
// //             items: [...prev.items, {
// //                 description: '',
// //                 quantity: 1,
// //                 unitPrice: 0,
// //                 type: BillingItemType.WORKSPACE
// //             }]
// //         }));
// //     };

// //     // עדכון פריט בחשבונית
// //     const updateItem = (index: number, field: string, value: any) => {
// //         setFormData(prev => ({
// //             ...prev,
// //             items: prev.items.map((item, i) =>
// //                 i === index ? { ...item, [field]: value } : item
// //             )
// //         }));
// //     };

// //     // הסרת פריט מהחשבונית
// //     const removeItem = (index: number) => {
// //         if (formData.items.length > 1) {
// //             setFormData(prev => ({
// //                 ...prev,
// //                 items: prev.items.filter((_, i) => i !== index)
// //             }));
// //         }
// //     };

// //     // יצירת חשבוניות חודשיות
// //     const handleGenerateMonthly = async () => {
// //         try {
// //             await generateMonthlyInvoices();
// //         } catch (error) {
// //             console.error('שגיאה ביצירת חשבוניות חודשיות:', error);
// //         }
// //     };

// //     // שליחת חשבונית במייל
// //     const handleSendEmail = async () => {
// //         if (!emailData.invoiceId || !emailData.email) return;

// //         try {
// //             await sendInvoiceByEmail(emailData.invoiceId, emailData.email);
// //             setEmailData({ invoiceId: '', email: '' });
// //         } catch (error) {
// //             console.error('שגיאה בשליחת מייל:', error);
// //         }
// //     };

// //     // עדכון סטטוס חשבונית
// //     const handleStatusUpdate = async (invoiceId: string, status: InvoiceStatus) => {
// //         try {
// //             await updateInvoiceStatus(invoiceId, status);
// //         } catch (error) {
// //             console.error('שגיאה בעדכון סטטוס:', error);
// //         }
// //     };

// //     // מחיקת חשבונית
// //     const handleDelete = async (invoice_number: string) => {
// //         console.log('מתחיל מחיקה של חשבונית:', invoice_number);
// //         console.log('סוג המזהה:', typeof invoice_number);

// //         if (!window.confirm(`האם אתה בטוח שברצונך למחוק את החשבונית ${invoice_number}?`)) {
// //             return;
// //         }

// //         try {
// //             await deleteInvoice(invoice_number);
// //             console.log('חשבונית נמחקה בהצלחה');
// //         } catch (error) {
// //             console.error('שגיאה במחיקת חשבונית:', error);
// //         }
// //     };

// //     return (
// //         <div className="invoice-management">
// //             <h1>ניהול חשבוניות</h1>
// //             <br />
// //             {error && (
// //                 <div>
// //                     שגיאה: {error}
// //                     <Button onClick={clearError}>✕</Button>
// //                 </div>
// //             )}

// //             {/* כפתורי פעולות ראשיים */}
// //             <div>
// //                 <Button onClick={() => setShowForm(!showForm)}>
// //                     {showForm ? 'ביטול' : 'יצירת חשבונית חדשה'}
// //                 </Button>
// //                 <Button onClick={handleGenerateMonthly}>
// //                     יצירת חשבוניות חודשיות
// //                 </Button>
// //             </div>

// //             {/* טופס יצירה/עריכה */}
// //             {showForm && (
// //                 <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
// //                     <h3>{editingInvoice ? `עריכת חשבונית ${editingInvoice.invoice_number}` : 'יצירת חשבונית חדשה'}</h3>
// //                     <form onSubmit={handleSubmit}>
// //                         <div style={{ marginBottom: '12px' }}>
// //                             <label>מזהה לקוח:</label>
// //                             <input
// //                                 type="text"
// //                                 value={formData.customerId}
// //                                 onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
// //                                 style={{ width: '100%', padding: '8px', marginTop: '4px' }}
// //                                 required
// //                             />
// //                         </div>
// //                         <div style={{ marginBottom: '12px' }}>
// //                             <label>שם לקוח:</label>
// //                             <input
// //                                 type="text"
// //                                 value={formData.customerName}
// //                                 onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
// //                                 style={{ width: '100%', padding: '8px', marginTop: '4px' }}
// //                                 required
// //                             />
// //                         </div>
// //                         <div style={{ marginBottom: '12px' }}>
// //                             <label>תאריך הנפקה:</label>
// //                             <input
// //                                 type="date"
// //                                 value={formData.issueDate}
// //                                 onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
// //                                 style={{ width: '100%', padding: '8px', marginTop: '4px' }}
// //                                 required
// //                             />
// //                         </div>
// //                         <div style={{ marginBottom: '12px' }}>
// //                             <label>תאריך פירעון:</label>
// //                             <input
// //                                 type="date"
// //                                 value={formData.dueDate}
// //                                 onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
// //                                 style={{ width: '100%', padding: '8px', marginTop: '4px' }}
// //                                 required
// //                             />
// //                         </div>

// //                         {/* פריטי החשבונית */}
// //                         <div style={{ marginBottom: '16px' }}>
// //                             <h4>פריטי החשבונית</h4>
// //                             {formData.items.map((item, index) => (
// //                                 <div key={index} style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '8px', borderRadius: '4px' }}>
// //                                     <div style={{ marginBottom: '8px' }}>
// //                                         <label>תיאור:</label>
// //                                         <input
// //                                             type="text"
// //                                             value={item.description}
// //                                             onChange={(e) => updateItem(index, 'description', e.target.value)}
// //                                             style={{ width: '100%', padding: '4px', marginTop: '2px' }}
// //                                             required
// //                                         />
// //                                     </div>
// //                                     <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
// //                                         <div style={{ flex: 1 }}>
// //                                             <label>כמות:</label>
// //                                             <input
// //                                                 type="number"
// //                                                 value={item.quantity}
// //                                                 onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
// //                                                 style={{ width: '100%', padding: '4px', marginTop: '2px' }}
// //                                                 min="1"
// //                                                 required
// //                                             />
// //                                         </div>
// //                                         <div style={{ flex: 1 }}>
// //                                             <label>מחיר יחידה:</label>
// //                                             <input
// //                                                 type="number"
// //                                                 value={item.unitPrice}
// //                                                 onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
// //                                                 style={{ width: '100%', padding: '4px', marginTop: '2px' }}
// //                                                 min="0"
// //                                                 step="0.01"
// //                                                 required
// //                                             />
// //                                         </div>
// //                                     </div>
// //                                     <div style={{ marginBottom: '8px' }}>
// //                                         <label>סוג:</label>
// //                                         <select
// //                                             value={item.type}
// //                                             onChange={(e) => updateItem(index, 'type', e.target.value)}
// //                                             style={{ width: '100%', padding: '4px', marginTop: '2px' }}
// //                                         >
// //                                             <option value={BillingItemType.WORKSPACE}>Workspace</option>
// //                                             <option value={BillingItemType.MEETING_ROOM}>Meeting Room</option>
// //                                             <option value={BillingItemType.LOUNGE}>Lounge</option>
// //                                             <option value={BillingItemType.SERVICE}>Service</option>
// //                                             <option value={BillingItemType.DISCOUNT}>Discount</option>
// //                                             <option value={BillingItemType.OTHER}>Other</option>
// //                                         </select>
// //                                     </div>
// //                                     {formData.items.length > 1 && (
// //                                         <Button
// //                                             type="button"
// //                                             onClick={() => removeItem(index)}
// //                                             style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
// //                                         >
// //                                             הסר פריט
// //                                         </Button>
// //                                     )}
// //                                 </div>
// //                             ))}
// //                             <Button
// //                                 type="button"
// //                                 onClick={addItem}
// //                                 style={{ backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
// //                             >
// //                                 הוסף פריט
// //                             </Button>
// //                         </div>

// //                         <div style={{ marginBottom: '16px' }}>
// //                             <Button
// //                                 type="submit"
// //                                 style={{
// //                                     padding: '8px 16px',
// //                                     backgroundColor: editingInvoice ? '#ff9800' : '#4caf50',
// //                                     color: 'white',
// //                                     border: 'none',
// //                                     borderRadius: '4px',
// //                                     cursor: 'pointer',
// //                                     marginRight: '8px'
// //                                 }}
// //                             >
// //                                 {editingInvoice ? 'עדכן חשבונית' : 'צור חשבונית'}
// //                             </Button>
// //                             {editingInvoice && (
// //                                 <Button
// //                                     type="button"
// //                                     onClick={resetForm}
// //                                     style={{
// //                                         padding: '8px 16px',
// //                                         backgroundColor: '#757575',
// //                                         color: 'white',
// //                                         border: 'none',
// //                                         borderRadius: '4px',
// //                                         cursor: 'pointer'
// //                                     }}
// //                                 >
// //                                     ביטול עריכה
// //                                 </Button>
// //                             )}
// //                         </div>
// //                     </form>
// //                 </div>
// //             )}

// //             <div>
// //                 <h3>רשימת חשבוניות ({invoices && Array.isArray(invoices) ? invoices.length : 0})</h3>
// //                 <div>
// //                     <Table
// //                         columns={columns}
// //                         data={tableData}
// //                     />
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default InvoiceManagement;


// //3
// //sunday
// // import React, { useState, useEffect } from 'react';
// // import { useInvoiceStore } from '../../../../Stores/Billing/invoiceStore';
// // import { InvoiceStatus, BillingItemType, CreateInvoiceRequest } from 'shared-types';
// // import { Table, TableColumn } from '../../../../Common/Components/BaseComponents/Table';
// // import {Button} from '../../../../Common/Components/BaseComponents/Button';

// // // מחלקה שמכילה הצהרה ומימוש פונקציות לניהול החשבוניות
// // export const InvoiceManagement: React.FC = () => {
// //     const {
// //         invoices,
// //         loading,
// //         error,
// //         getAllInvoices,
// //         createInvoice,
// //         updateInvoice,
// //         updateInvoiceStatus,
// //         deleteInvoice,
// //         generateMonthlyInvoices,
// //         sendInvoiceByEmail,
// //         getOverdueInvoices,
// //         getInvoicesByStatus,
// //         calculateOpenInvoicesTotal,
// //         clearError
// //     } = useInvoiceStore();

// //     const [showForm, setShowForm] = useState(false);
// //     const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(InvoiceStatus.DRAFT);
// //     const [emailData, setEmailData] = useState({ invoiceId: '', email: '' });
// //     const [editingInvoice, setEditingInvoice] = useState<any>(null);

// //     const [formData, setFormData] = useState({
// //         customerId: '',
// //         customerName: '',
// //         issueDate: new Date().toISOString().split('T')[0],
// //         dueDate: '',
// //         items: [{
// //             description: '',
// //             quantity: 1,
// //             unitPrice: 0,
// //             type: BillingItemType.WORKSPACE
// //         }]
// //     });

// //     useEffect(() => {
// //         console.log(' קומפוננטה נטענת - מתחיל לשלוף חשבוניות');
// //         getAllInvoices();
// //     }, [getAllInvoices]);

// //     // הוסיפי useEffect נוסף לבדיקת שינויים ב-invoices
// //     useEffect(() => {
// //         console.log(' invoices השתנה:', invoices);
// //         console.log(' סוג:', typeof invoices);
// //         console.log(' האם מערך?', Array.isArray(invoices));
// //         console.log(' כמות:', invoices?.length || 0);
// //         if (invoices && invoices.length > 0) {
// //             console.log('שדות החשבונית הראשונה:', Object.keys(invoices[0]));
// //             console.log('החשבונית הראשונה המלאה:', invoices[0]);
// //         }
// //     }, [invoices]);

// //     // הגדרת עמודות הטבלה
// //     const columns: TableColumn<any>[] = [
// //         { header: 'מספר חשבונית', accessor: 'invoice_number' },
// //         { header: 'שם לקוח', accessor: 'customer_name' },
// //         { header: 'סטטוס', accessor: 'status' },
// //         { header: 'תאריך הנפקה', accessor: 'issue_date' },
// //         { header: 'תאריך פירעון', accessor: 'due_date' },
// //         { header: 'פרטי חיוב', accessor: 'items' },
// //         { header: 'סכום ביניים', accessor: 'subtotal' },
// //         { header: 'מס', accessor: 'tax_total' },
// //         { header: 'תזכורת לתשלום נשלחה בתאריך', accessor: 'payment_due_reminder_sent_at' },
// //         { header: 'נוצר בתאריך', accessor: 'created_at' },
// //         { header: 'עודכן בתאריך', accessor: 'updated_at' },
// //         { header: 'פעולות', accessor: 'actions' }
// //     ];

// //     // עיבוד הנתונים לטבלה
// //  //   const tableData = (invoices && Array.isArray(invoices) ? invoices : []).map((invoice, index) => {
// //     //     console.log('מבנה החשבונית:', invoice);

// //     //     return {
// //     //         ...invoice,
// //     //         items: invoice.items && invoice.items.length > 0 ? (
// //     //             <div>
// //     //                 {invoice.items.map((item, itemIndex) => (
// //     //                     <div key={itemIndex}>
// //     //                         <div>ID: {item.id}</div>
// //     //                         <div>Invoice ID: {item.invoice_id}</div>
// //     //                         <div>תיאור: {item.description}</div>
// //     //                         <div>סוג: {item.type}</div>
// //     //                         <div>כמות: {item.quantity}</div>
// //     //                         <div>מחיר יחידה: ₪{item.unit_price}</div>
// //     //                         <div>מחיר כולל: ₪{item.total_price}</div>
// //     //                         <div>שיעור מס: {item.tax_rate}%</div>
// //     //                         <div>סכום מס: ₪{item.tax_amount}</div>
// //     //                         {item.workspace_type && <div>סוג workspace: {item.workspace_type}</div>}
// //     //                         {item.booking_id && <div>Booking ID: {item.booking_id}</div>}
// //     //                         <div>נוצר: {item.createdAt}</div>
// //     //                         <div>עודכן: {item.updatedAt}</div>
// //     //                     </div>
// //     //                 ))}
// //     //             </div>
// //     //         ) : (
// //     //             <span>אין פריטים</span>
// //     //         ),
// //     //         actions: (
// //     //             <div
// //     //                 style={{ display: 'flex', gap: '8px' }}>
// //     //                 <Button
// //     //                     onClick={() => handleEdit(invoice)}
// //     //                     style={{ backgroundColor: '#2196f3', color: 'white', padding: '4px 8px' }}
// //     //                 >
// //     //                     ערוך
// //     //                 </Button>
// //     //                 <Button
// //     //                     onClick={() => invoice.id &&handleDelete(invoice.id)}
// //     //                     style={{ backgroundColor: '#f44336', color: 'white', padding: '4px 8px' }}
// //     //                 >
// //     //                     מחק
// //     //                 </Button>
// //     //             </div>
// //     //         )
// //     //     };
// //     // });
// // // עיבוד הנתונים לטבלה
// // const tableData = (invoices && Array.isArray(invoices) ? invoices : []).map((invoice, index) => {
// //     console.log('מבנה החשבונית:', invoice);
// //     return {
// //         ...invoice,
// //         // עיצוב תאריך הנפקה
// //         issue_date: invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('he-IL') : '',

// //         // עיצוב תאריך פירעון
// //         due_date: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('he-IL') : '',

// //         // עיצוב סכום ביניים
// //         subtotal: invoice.subtotal ? `₪${invoice.subtotal.toFixed(2)}` : '₪0.00',

// //         // עיצוב מס
// //         tax_total: invoice.tax_total ? `₪${invoice.tax_total.toFixed(2)}` : '₪0.00',

// //         // // עיצוב תאריך תזכורת
// //         // payment_due_reminder_sent_at: invoice.payment_due_reminder_sent_at ? 
// //         //     new Date(invoice.createdAt).toLocaleDateString('he-IL') : 'לא נשלחה',

// //         // // עיצוב תאריך יצירה
// //         // created_at: invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('he-IL') : '',

// //         // // עיצוב תאריך עדכון
// //         // updated_at: invoice.updated_at ? new Date(invoice.updated_at).toLocaleDateString('he-IL') : '',

// //         // עיצוב סטטוס
// //         status: invoice.status ? invoice.status.replace('_', ' ') : '',

// //         // עיבוד פרטי חיוב
// //         items: invoice.items && invoice.items.length > 0 ? (
// //             <div >
// //                 {invoice.items.map((item, itemIndex) => (
// //                     <div key={itemIndex} >
// //                         <div><strong>תיאור:</strong> {item.description}</div>
// //                         <div><strong>סוג:</strong> {item.type}</div>
// //                         <div><strong>כמות:</strong> {item.quantity}</div>
// //                         <div><strong>מחיר יחידה:</strong> ₪{item.unit_price}</div>
// //                         <div><strong>מחיר כולל:</strong> ₪{item.total_price}</div>
// //                         <div><strong>שיעור מס:</strong> {item.tax_rate}%</div>
// //                         <div><strong>סכום מס:</strong> ₪{item.tax_amount}</div>
// //                         {item.workspace_type && <div><strong>סוג workspace:</strong> {item.workspace_type}</div>}
// //                         {item.booking_id && <div><strong>Booking ID:</strong> {item.booking_id}</div>}
// //                     </div>
// //                 ))}
// //             </div>
// //         ) : (
// //             <span >אין פריטים</span>
// //         ),


// //         // כפתורי פעולות
// //         actions: (
// //             <div >
// //                 <Button 
// //                     onClick={() => handleEdit(invoice)}  
// //                 >
// //                     ערוך
// //                 </Button>
// //                 <Button
// //                     onClick={() => invoice.id && handleDelete(invoice.id)}
// //                 >
// //                     מחק
// //                 </Button>
// //             </div>
// //         )
// //     };
// // });

// //     // איפוס הטופס
// //     const resetForm = () => {
// //         setFormData({
// //             customerId: '',
// //             customerName: '',
// //             issueDate: new Date().toISOString().split('T')[0],
// //             dueDate: '',
// //             items: [{
// //                 description: '',
// //                 quantity: 1,
// //                 unitPrice: 0,
// //                 type: BillingItemType.WORKSPACE
// //             }]
// //         });
// //         setShowForm(false);
// //         setEditingInvoice(null);
// //     };

// //     // טיפול בעריכת חשבונית
// //     // const handleEdit = (invoice: any) => {
// //     //     setEditingInvoice(invoice);
// //     //     setFormData({
// //     //         customerId: invoice.customer_id || '',
// //     //         customerName: invoice.customer_name || '',
// //     //         issueDate: invoice.issue_date ? invoice.issue_date.split('T')[0] : new Date().toISOString().split('T')[0],
// //     //         dueDate: invoice.due_date ? invoice.due_date.split('T')[0] : '',
// //     //         items: invoice.items && invoice.items.length > 0 ? invoice.items.map((item: any) => ({
// //     //             description: item.description || '',
// //     //             quantity: item.quantity || 1,
// //     //             unitPrice: item.unit_price || 0,
// //     //             type: item.type || BillingItemType.WORKSPACE
// //     //         })) : [{
// //     //             description: '',
// //     //             quantity: 1,
// //     //             unitPrice: 0,
// //     //             type: BillingItemType.WORKSPACE
// //     //         }]
// //     //     });
// //     //     setShowForm(true);
// //     // };
// // // תקן את פונקציית handleEdit
// // // הוסף או תקן את הפונקציה הזו
// // const handleEdit = (invoice: any) => {
// //     setEditingInvoice(invoice);

// //     setFormData({
// //         customerId: invoice.customer_id || '',
// //         customerName: invoice.customer_name || '',
// //         issueDate: invoice.issue_date ? invoice.issue_date.split('T')[0] : new Date().toISOString().split('T')[0],
// //         dueDate: invoice.due_date ? invoice.due_date.split('T')[0] : '',
// //         items: invoice.items && invoice.items.length > 0 
// //             ? invoice.items.map((item: any) => ({
// //                 description: item.description || '',
// //                 quantity: item.quantity || 1,
// //                 unitPrice: item.unit_price || 0,
// //                 type: item.type || BillingItemType.WORKSPACE
// //             }))
// //             : [{
// //                 description: '',
// //                 quantity: 1,
// //                 unitPrice: 0,
// //                 type: BillingItemType.WORKSPACE
// //             }]
// //     });

// //     setShowForm(true);
// // };

// //  const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
// //     const taxAmount = subtotal * 0.17;

// //     try {
// //         if (editingInvoice) {
// //             // עדכון חשבונית קיימת - השתמש ב-id במקום invoice_number
// //             const updateData = {
// //                 customer_id: formData.customerId,
// //                 customer_name: formData.customerName,
// //                 issue_date: formData.issueDate,
// //                 due_date: formData.dueDate,
// //                 subtotal: subtotal,
// //                 tax_total: taxAmount,
// //             };

// //             // השינוי היחיד: השתמש ב-editingInvoice.id במקום editingInvoice.invoice_number
// //             await updateInvoice(editingInvoice.id, updateData);
// //             console.log('חשבונית עודכנה בהצלחה');
// //         } else {
// //             // יצירת חשבונית חדשה - ללא שינוי
// //             const invoiceData: CreateInvoiceRequest = {
// //                 customerId: formData.customerId,
// //                 issueDate: formData.issueDate,
// //                 dueDate: formData.dueDate,
// //                 items: formData.items.map((item) => ({
// //                     type: item.type,
// //                     description: item.description,
// //                     quantity: item.quantity,
// //                     unitPrice: item.unitPrice,
// //                     taxRate: 17,
// //                 })),
// //                 notes: ''
// //             };
// //             await createInvoice(invoiceData);
// //             console.log('חשבונית נוצרה בהצלחה');
// //         }

// //         resetForm();
// //     } catch (error) {
// //         console.error('שגיאה בטיפול בחשבונית:', error);
// //     }
// // };

// //     // הוספת פריט חדש לחשבונית
// //     const addItem = () => {
// //         setFormData(prev => ({
// //             ...prev,
// //             items: [...prev.items, {
// //                 description: '',
// //                 quantity: 1,
// //                 unitPrice: 0,
// //                 type: BillingItemType.WORKSPACE
// //             }]
// //         }));
// //     };

// //     // עדכון פריט בחשבונית
// //     const updateItem = (index: number, field: string, value: any) => {
// //         setFormData(prev => ({
// //             ...prev,
// //             items: prev.items.map((item, i) =>
// //                 i === index ? { ...item, [field]: value } : item
// //             )
// //         }));
// //     };

// //     // הסרת פריט מהחשבונית
// //     const removeItem = (index: number) => {
// //         if (formData.items.length > 1) {
// //             setFormData(prev => ({
// //                 ...prev,
// //                 items: prev.items.filter((_, i) => i !== index)
// //             }));
// //         }
// //     };


// //     // שליחת חשבונית במייל
// //     const handleSendEmail = async () => {
// //         if (!emailData.invoiceId || !emailData.email) return;

// //         try {
// //             await sendInvoiceByEmail(emailData.invoiceId, emailData.email);
// //             setEmailData({ invoiceId: '', email: '' });
// //         } catch (error) {
// //             console.error('שגיאה בשליחת מייל:', error);
// //         }
// //     };

// //     // עדכון סטטוס חשבונית
// //     const handleStatusUpdate = async (invoiceId: string, status: InvoiceStatus) => {
// //         try {
// //             await updateInvoiceStatus(invoiceId, status);
// //         } catch (error) {
// //             console.error('שגיאה בעדכון סטטוס:', error);
// //         }
// //     };

// //     // מחיקת חשבונית - השתמש ב-ID
// //     const handleDelete = async (id: string) => {
// //         console.log('מתחיל מחיקה של חשבונית עם ID:', id);
// //         console.log('סוג המזהה:', typeof id);

// //         // הוסף אישור למחיקה
// //         if (!window.confirm(`האם אתה בטוח שברצונך למחוק את החשבונית?`)) {
// //             return;
// //         }

// //         try {
// //             await deleteInvoice(id);
// //             console.log('חשבונית נמחקה בהצלחה');
// //         } catch (error) {
// //             console.error('שגיאה במחיקת חשבונית:', error);
// //         }
// //     };

// //     return (
// //         <div className="invoice-management">
// //             <h1>ניהול חשבוניות</h1>
// //             <br />
// //             {error && (
// //                 <div >
// //                     שגיאה: {error}
// //                     <Button onClick={clearError} >✕</Button>
// //                 </div>
// //             )}

// //             {/* כפתורי פעולות ראשיים */}
// //             <div >
// //                 <Button
// //                     onClick={() => {
// //                         if (showForm && !editingInvoice) {
// //                             resetForm();
// //                         } else {
// //                             setShowForm(!showForm);
// //                             setEditingInvoice(null);
// //                         }
// //                     }}

// //                 >
// //                     {showForm ? 'ביטול' : 'יצירת חשבונית חדשה'}
// //                 </Button>

// //             </div>

// //             {/* טופס יצירה/עריכה */}
// //             {showForm && (
// //                 <div >
// //                     <h3>{editingInvoice ? 'עריכת חשבונית' : 'יצירת חשבונית חדשה'}</h3>
// //                     <form onSubmit={handleSubmit}>
// //                         <div >
// //                             <label>מזהה לקוח:</label>
// //                             <input
// //                                 type="text"
// //                                 value={formData.customerId}
// //                                 onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}

// //                                 required
// //                             />
// //                         </div>
// //                         <div >
// //                             <label>שם לקוח:</label>
// //                             <input
// //                                 type="text"
// //                                 value={formData.customerName}
// //                                 onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}

// //                                 required
// //                             />
// //                         </div>
// //                         <div >
// //                             <label>תאריך הנפקה:</label>
// //                             <input
// //                                 type="date"
// //                                 value={formData.issueDate}
// //                                 onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}

// //                                 required
// //                             />
// //                         </div>
// //                         <div >
// //                             <label>תאריך פירעון:</label>
// //                             <input
// //                                 type="date"
// //                                 value={formData.dueDate}
// //                                 onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}

// //                                 required
// //                             />
// //                         </div>

// //                         {/* פריטי החשבונית */}
// //                         <div >
// //                             <h4>פריטי החשבונית</h4>
// //                             {formData.items.map((item, index) => (
// //                                 <div key={index} >
// //                                     <div >
// //                                         <label>תיאור:</label>
// //                                         <input
// //                                             type="text"
// //                                             value={item.description}
// //                                             onChange={(e) => updateItem(index, 'description', e.target.value)}

// //                                             required
// //                                         />
// //                                     </div>
// //                                     <div >
// //                                         <div >
// //                                             <label>כמות:</label>
// //                                             <input
// //                                                 type="number"
// //                                                 value={item.quantity}
// //                                                 onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}

// //                                                 min="1"
// //                                                 required
// //                                             />
// //                                         </div>
// //                                         <div>
// //                                             <label>מחיר יחידה:</label>
// //                                             <input
// //                                                 type="number"
// //                                                 value={item.unitPrice}
// //                                                 onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}

// //                                                 min="0"
// //                                                 step="0.01"
// //                                                 required
// //                                             />
// //                                         </div>
// //                                     </div>
// //                                     <div >
// //                                         <label>סוג:</label>
// //                                         <select
// //                                             value={item.type}
// //                                             onChange={(e) => updateItem(index, 'type', e.target.value)}

// //                                         >
// //                                             <option value={BillingItemType.WORKSPACE}>Workspace</option>
// //                                             <option value={BillingItemType.MEETING_ROOM}>Meeting Room</option>
// //                                             <option value={BillingItemType.LOUNGE}>Lounge</option>
// //                                             <option value={BillingItemType.SERVICE}>Service</option>
// //                                             <option value={BillingItemType.DISCOUNT}>Discount</option>
// //                                             <option value={BillingItemType.OTHER}>Other</option>
// //                                         </select>
// //                                     </div>
// //                                     {formData.items.length > 1 && (
// //                                         <Button
// //                                             type="button"
// //                                             onClick={() => removeItem(index)}

// //                                         >
// //                                             הסר פריט
// //                                         </Button>
// //                                     )}
// //                                 </div>
// //                             ))}
// //                         </div>

// //                         <div >
// //                             <Button
// //                                 type="submit"

// //                             >
// //                                 {editingInvoice ? 'עדכן חשבונית' : 'צור חשבונית'}
// //                             </Button>
// //                             <Button
// //                                 type="button"
// //                                 onClick={resetForm}

// //                             >
// //                                 ביטול
// //                             </Button>
// //                         </div>
// //                     </form>
// //                 </div>
// //             )}

// //             <div>
// //                 <h3>רשימת חשבוניות ({invoices && Array.isArray(invoices) ? invoices.length : 0})</h3>
// //                 <div>
// //                     <Table
// //                         columns={columns}
// //                         data={tableData}
// //                     />
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default InvoiceManagement;


// ////////////////new sunday -afternoon


// import React, { useState, useEffect } from 'react';
// import { useInvoiceStore } from '../../../../Stores/Billing/invoiceStore';
// import { InvoiceStatus, BillingItemType, CreateInvoiceRequest } from 'shared-types';
// import { Table, TableColumn } from '../../../../Common/Components/BaseComponents/Table';
// import { Button } from '../../../../Common/Components/BaseComponents/Button';
// import Swal from 'sweetalert2';

// // מחלקה שמכילה הצהרה ומימוש פונקציות לניהול החשבוניות
// export const InvoiceManagement: React.FC = () => {

//     const {
//         invoices,
//         loading,
//         error,
//         getAllInvoices,
//         getAllInvoiceItems,
//         createInvoice,
//         updateInvoice,
//         updateInvoiceStatus,
//         deleteInvoice,
//         generateMonthlyInvoices,
//         sendInvoiceByEmail,
//         getOverdueInvoices,
//         getInvoicesByStatus,
//         calculateOpenInvoicesTotal,
//         clearError
//     } = useInvoiceStore();

//     const [showForm, setShowForm] = useState(false);
//     const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(InvoiceStatus.DRAFT);
//     const [emailData, setEmailData] = useState({ invoiceId: '', email: '' });
//     const [editingInvoice, setEditingInvoice] = useState<any>(null);

//     const [formData, setFormData] = useState({
//         customerId: '',
//         customerName: '',
//         issueDate: new Date().toISOString().split('T')[0],
//         dueDate: '',
//         items: [{
//             description: '',
//             quantity: 1,
//             unitPrice: 0,
//             type: BillingItemType.WORKSPACE
//         }]
//     });

//     useEffect(() => {
//         console.log(' קומפוננטה נטענת - מתחיל לשלוף חשבוניות');
//         getAllInvoices();

//     }, [getAllInvoices]);


//     // הגדרת עמודות הטבלה - הסרת עמודת הפעולות
//     // הגדרת עמודות הטבלה
//     const columns: TableColumn<any>[] = [
//         { header: 'מספר חשבונית', accessor: 'invoice_number' },
//         { header: 'שם לקוח', accessor: 'customer_name' },
//         { header: 'סטטוס', accessor: 'status' },
//         { header: 'תאריך הנפקה', accessor: 'issue_date' },
//         { header: 'תאריך פירעון', accessor: 'due_date' },
//         // {
//         //     header: 'פרטי חיוב',
//         //     accessor: 'items',

//         //     render: (value: any, row: any) => {
//         //         console.log('🎨 מרנדר פריטים:', value);
//         //         console.log('🎨 שורה מלאה:', row);

//         //         if (!value || !Array.isArray(value) || value.length === 0) {
//         //             return <span style={{ color: '#666', fontStyle: 'italic' }}>אין פריטים</span>;
//         //         }

//         //         return (
//         //             <div style={{ maxWidth: '300px', maxHeight: '150px', overflow: 'auto' }}>
//         //                 {value.map((item: any, itemIndex: number) => (
//         //                     <div key={itemIndex} style={{
//         //                         border: '1px solid #e0e0e0',
//         //                         padding: '8px',
//         //                         margin: '4px 0',
//         //                         borderRadius: '4px',
//         //                         backgroundColor: '#f9f9f9',
//         //                         fontSize: '12px'
//         //                     }}>
//         //                         <div><strong>תיאור:</strong> {item.description || 'לא צוין'}</div>
//         //                         <div><strong>סוג:</strong> {item.type || 'לא צוין'}</div>
//         //                         <div><strong>כמות:</strong> {item.quantity || 0}</div>
//         //                         <div><strong>מחיר יחידה:</strong> ₪{item.unit_price || 0}</div>
//         //                         <div><strong>מחיר כולל:</strong> ₪{item.total_price || 0}</div>
//         //                         <div><strong>שיעור מס:</strong> {item.tax_rate || 0}%</div>
//         //                         <div><strong>סכום מס:</strong> ₪{item.tax_amount || 0}</div>
//         //                         {item.workspace_type && <div><strong>סוג workspace:</strong> {item.workspace_type}</div>}
//         //                         {item.booking_id && <div><strong>Booking ID:</strong> {item.booking_id}</div>}
//         //                     </div>
//         //                 ))}
//         //             </div>
//         //         );
//         //     }
//         // },
//         {
//             header: 'פרטי חיוב',
//             accessor: 'getInvoiceItems',
//             render: (value: any, row: any) => {
//                 return (
//                     <button onClick={() => getAllInvoiceItems(row.id)}>
//                         פרטי חיוב
//                     </button>
//                 );
//             }

//         },
//         { header: 'סכום ביניים', accessor: 'subtotal' },
//         { header: 'מס', accessor: 'tax_total' },
//         { header: 'תזכורת לתשלום נשלחה בתאריך', accessor: 'payment_due_reminder_sent_at' },
//         { header: 'נוצר בתאריך', accessor: 'created_at' },
//         { header: 'עודכן בתאריך', accessor: 'updated_at' }
//     ];

//     const tableData = (invoices && Array.isArray(invoices) ? invoices : []).map((invoice, index) => {
//         console.log(`🔍 מעבד חשבונית ${index} - ${invoice.invoice_number}`);
//         console.log(`📋 פריטים גולמיים:`, invoice.items);
//         console.log(`📋 סוג פריטים:`, typeof invoice.items);
//         console.log(`📋 האם מערך?:`, Array.isArray(invoice.items));

//         return {
//             ...invoice,
//             // עיצוב תאריך הנפקה
//             issue_date: invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('he-IL') : '',
//             // עיצוב תאריך פירעון
//             due_date: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('he-IL') : '',
//             // עיצוב סכום ביניים
//             subtotal: invoice.subtotal ? `₪${invoice.subtotal.toFixed(2)}` : '₪0.00',
//             // עיצוב מס
//             tax_total: invoice.tax_total ? `₪${invoice.tax_total.toFixed(2)}` : '₪0.00',
//             // עיצוב סטטוס
//             status: invoice.status ? invoice.status.replace('_', ' ') : '',
//             // עיצוב תאריך יצירה
//             created_at: invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('he-IL') : '',
//             // עיצוב תאריך עדכון
//             updated_at: invoice.updatedAt ? new Date(invoice.updatedAt).toLocaleDateString('he-IL') : '',
//             // עיצוב תזכורת תשלום
//             payment_due_reminder_sent_at: invoice.payment_dueReminder_sent_at ?
//                 new Date(invoice.payment_dueReminder_sent_at).toLocaleDateString('he-IL') : 'לא נשלחה'
//         };
//     });

//     // איפוס הטופס
//     const resetForm = () => {
//         setFormData({
//             customerId: '',
//             customerName: '',
//             issueDate: new Date().toISOString().split('T')[0],
//             dueDate: '',
//             items: [{
//                 description: '',
//                 quantity: 1,
//                 unitPrice: 0,
//                 type: BillingItemType.WORKSPACE
//             }]
//         });
//         setShowForm(false);
//         setEditingInvoice(null);
//     };

//     // טיפול בעריכת חשבונית
//     const handleEdit = (invoice: any) => {
//         setEditingInvoice(invoice);
//         // הכנת הנתונים לטופס
//         const formDataForEdit = {
//             customerId: invoice.customer_id || '',
//             customerName: invoice.customer_name || '',
//             issueDate: invoice.issue_date && !isNaN(new Date(invoice.issue_date).getTime())
//                 ? new Date(invoice.issue_date).toISOString().split('T')[0]
//                 : new Date().toISOString().split('T')[0],
//             dueDate: invoice.due_date && !isNaN(new Date(invoice.due_date).getTime())
//                 ? new Date(invoice.due_date).toISOString().split('T')[0]
//                 : '',

//             // יצירת מערך של פריטים עבור הטופס

//             items: invoice.items && invoice.items.length > 0
//                 ? invoice.items.map((item: any) => ({
//                     description: item.description || '',
//                     quantity: item.quantity || 1,
//                     unitPrice: item.unit_price || 0,
//                     type: item.type || BillingItemType.WORKSPACE
//                 }))
//                 : [{
//                     description: '',
//                     quantity: 1,
//                     unitPrice: 0,
//                     type: BillingItemType.WORKSPACE
//                 }]
//         };

//         // יצירת HTML לפריטים
//         const itemsHtml = formDataForEdit.items.map((item: any, index: number) => `
//         <div id="item-${index}" style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px;">
//             <h4>פריט ${index + 1}</h4>
//             <div>
//                 <label>תיאור:</label>
//                 <input id="description-${index}" type="text" value="${item.description}" required />
//             </div>
//             <div>
//                 <label>כמות:</label>
//                 <input id="quantity-${index}" type="number" value="${item.quantity}" min="1" required />
//             </div>
//             <div>
//                 <label>מחיר יחידה:</label>
//                 <input id="unitPrice-${index}" type="number" value="${item.unitPrice}" min="0" step="0.01" required />
//             </div>
//             <div>
//                 <label>סוג:</label>
//                 <select id="type-${index}">
//                     <option value="${BillingItemType.WORKSPACE}" ${item.type === BillingItemType.WORKSPACE ? 'selected' : ''}>Workspace</option>
//                     <option value="${BillingItemType.MEETING_ROOM}" ${item.type === BillingItemType.MEETING_ROOM ? 'selected' : ''}>Meeting Room</option>
//                     <option value="${BillingItemType.LOUNGE}" ${item.type === BillingItemType.LOUNGE ? 'selected' : ''}>Lounge</option>
//                     <option value="${BillingItemType.SERVICE}" ${item.type === BillingItemType.SERVICE ? 'selected' : ''}>Service</option>
//                     <option value="${BillingItemType.DISCOUNT}" ${item.type === BillingItemType.DISCOUNT ? 'selected' : ''}>Discount</option>
//                     <option value="${BillingItemType.OTHER}" ${item.type === BillingItemType.OTHER ? 'selected' : ''}>Other</option>
//                 </select>
//             </div>
//         </div>
//     `).join('');

//         // יצירת HTML לטופס המלא
//         const formHtml = `
//         <div>
//             <div>
//                 <label>מזהה לקוח:</label>
//                 <input id="customerId" type="text" value="${formDataForEdit.customerId}" required />
//             </div>
//             <div>
//                 <label>שם לקוח:</label>
//                 <input id="customerName" type="text" value="${formDataForEdit.customerName}" required />
//             </div>
//             <div>
//                 <label>תאריך הנפקה:</label>
//                 <input id="issueDate" type="date" value="${formDataForEdit.issueDate}" required />
//             </div>
//             <div>
//                 <label>תאריך פירעון:</label>
//                 <input id="dueDate" type="date" value="${formDataForEdit.dueDate}" required />
//             </div>
//             <div>
//                 <h3>פריטי החשבונית</h3>
//                 <div id="items-container">
//                     ${itemsHtml}
//                 </div>
//             </div>
//         </div>
//     `;

//         // הצגת הפופאפ
//         Swal.fire({
//             title: 'עריכת חשבונית',
//             html: formHtml,
//             showCancelButton: true,
//             confirmButtonText: 'עדכן חשבונית',
//             cancelButtonText: 'ביטול',
//             width: '800px',
//             preConfirm: () => {
//                 const customerId = (document.getElementById('customerId') as HTMLInputElement).value;
//                 const customerName = (document.getElementById('customerName') as HTMLInputElement).value;
//                 const issueDate = (document.getElementById('issueDate') as HTMLInputElement).value;
//                 const dueDate = (document.getElementById('dueDate') as HTMLInputElement).value;

//                 // בדיקה אם כל השדות מולאים
//                 if (!customerId || !customerName || !issueDate || !dueDate) {
//                     Swal.showValidationMessage('אנא מלא את כל השדות');
//                     return false;
//                 }

//                 // איסוף נתוני הפריטים
//                 const items = formDataForEdit.items.map((_: any, index: number) => ({
//                     description: (document.getElementById(`description-${index}`) as HTMLInputElement).value,
//                     quantity: parseInt((document.getElementById(`quantity-${index}`) as HTMLInputElement).value),
//                     unitPrice: parseFloat((document.getElementById(`unitPrice-${index}`) as HTMLInputElement).value),
//                     type: (document.getElementById(`type-${index}`) as HTMLSelectElement).value
//                 }));

//                 // כאן תתבצע העדכון של החשבונית
//                 return {
//                     customerId,
//                     customerName,
//                     issueDate,
//                     dueDate,
//                     items
//                 };
//             }
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 const subtotal = result.value.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
//                 const taxAmount = subtotal * 0.17;

//                 const updateData = {
//                     customer_id: result.value.customerId,
//                     customer_name: result.value.customerName,
//                     issue_date: result.value.issueDate,
//                     due_date: result.value.dueDate,
//                     subtotal: subtotal,
//                     tax_total: taxAmount,
//                 };

//                 try {
//                     await updateInvoice(invoice.id, updateData);
//                     Swal.fire('הצלחה!', 'החשבונית עודכנה בהצלחה', 'success');
//                     setEditingInvoice(null);
//                 } catch (error) {
//                     console.error('שגיאה בעדכון חשבונית:', error);
//                     Swal.fire('שגיאה!', 'אירעה שגיאה בעדכון החשבונית', 'error');
//                 }
//             }
//         });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
//         const taxAmount = subtotal * 0.17;

//         try {
//             if (editingInvoice) {
//                 // עדכון חשבונית קיימת - השתמש ב-id במקום invoice_number
//                 const updateData = {
//                     customer_id: formData.customerId,
//                     customer_name: formData.customerName,
//                     issue_date: formData.issueDate,
//                     due_date: formData.dueDate,
//                     subtotal: subtotal,
//                     tax_total: taxAmount,
//                 };

//                 // השינוי היחיד: השתמש ב-editingInvoice.id במקום editingInvoice.invoice_number
//                 await updateInvoice(editingInvoice.id, updateData);
//                 console.log('חשבונית עודכנה בהצלחה');
//             } else {
//                 // יצירת חשבונית חדשה - ללא שינוי
//                 const invoiceData: CreateInvoiceRequest = {
//                     customerId: formData.customerId,
//                     issueDate: formData.issueDate,
//                     dueDate: formData.dueDate,
//                     items: formData.items.map((item) => ({
//                         type: item.type,
//                         description: item.description,
//                         quantity: item.quantity,
//                         unitPrice: item.unitPrice,
//                         taxRate: 17,
//                     })),
//                     notes: ''
//                 };
//                 await createInvoice(invoiceData);
//                 console.log('חשבונית נוצרה בהצלחה');
//             }

//             resetForm();
//         } catch (error) {
//             console.error('שגיאה בטיפול בחשבונית:', error);
//         }
//     };

//     // הוספת פריט חדש לחשבונית
//     const addItem = () => {
//         setFormData(prev => ({
//             ...prev,
//             items: [...prev.items, {
//                 description: '',
//                 quantity: 1,
//                 unitPrice: 0,
//                 type: BillingItemType.WORKSPACE
//             }]
//         }));
//     };

//     // עדכון פריט בחשבונית
//     const updateItem = (index: number, field: string, value: any) => {
//         setFormData(prev => ({
//             ...prev,
//             items: prev.items.map((item, i) =>
//                 i === index ? { ...item, [field]: value } : item
//             )
//         }));
//     };

//     // הסרת פריט מהחשבונית
//     const removeItem = (index: number) => {
//         if (formData.items.length > 1) {
//             setFormData(prev => ({
//                 ...prev,
//                 items: prev.items.filter((_, i) => i !== index)
//             }));
//         }
//     };

//     // שליחת חשבונית במייל
//     const handleSendEmail = async () => {
//         if (!emailData.invoiceId || !emailData.email) return;

//         try {
//             await sendInvoiceByEmail(emailData.invoiceId, emailData.email);
//             setEmailData({ invoiceId: '', email: '' });
//         } catch (error) {
//             console.error('שגיאה בשליחת מייל:', error);
//         }
//     };

//     // עדכון סטטוס חשבונית
//     const handleStatusUpdate = async (invoiceId: string, status: InvoiceStatus) => {
//         try {
//             await updateInvoiceStatus(invoiceId, status);
//         } catch (error) {
//             console.error('שגיאה בעדכון סטטוס:', error);
//         }
//     };

//     // מחיקת חשבונית - השתמש ב-ID
//     const handleDelete = async (id: string) => {
//         console.log('מתחיל מחיקה של חשבונית עם ID:', id);
//         console.log('סוג המזהה:', typeof id);

//         // הוסף אישור למחיקה
//         if (!window.confirm(`האם אתה בטוח שברצונך למחוק את החשבונית?`)) {
//             return;
//         }

//         try {
//             await deleteInvoice(id);
//             console.log('חשבונית נמחקה בהצלחה');
//         } catch (error) {
//             console.error('שגיאה במחיקת חשבונית:', error);
//         }
//     };

//     return (

//         <div className="invoice-management">
//             <h1>ניהול חשבוניות</h1>
//             <br />
//             {error && (
//                 <div>
//                     שגיאה: {error}
//                     <Button onClick={clearError}>✕</Button>
//                 </div>
//             )}

//             {/* כפתורי פעולות ראשיים */}
//             <div>
//                 <Button
//                     onClick={() => {
//                         if (showForm && !editingInvoice) {
//                             resetForm();
//                         } else {
//                             setShowForm(!showForm);
//                             setEditingInvoice(null);
//                         }
//                     }}
//                 >
//                     {showForm ? 'ביטול' : 'יצירת חשבונית חדשה'}
//                 </Button>
//             </div>

//             {/* טופס יצירה/עריכה */}
//             {showForm && (
//                 <div>
//                     <h3>{editingInvoice ? 'עריכת חשבונית' : 'יצירת חשבונית חדשה'}</h3>
//                     <form onSubmit={handleSubmit}>
//                         <div>
//                             <label>מזהה לקוח:</label>
//                             <input
//                                 type="text"
//                                 value={formData.customerId}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label>שם לקוח:</label>
//                             <input
//                                 type="text"
//                                 value={formData.customerName}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label>תאריך הנפקה:</label>
//                             <input
//                                 type="date"
//                                 value={formData.issueDate}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label>תאריך פירעון:</label>
//                             <input
//                                 type="date"
//                                 value={formData.dueDate}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
//                                 required
//                             />
//                         </div>

//                         {/* פריטי החשבונית */}
//                         <div>
//                             <h4>פריטי החשבונית</h4>
//                             {formData.items.map((item, index) => (
//                                 <div key={index}>
//                                     <div>
//                                         <label>תיאור:</label>
//                                         <input
//                                             type="text"
//                                             value={item.description}
//                                             onChange={(e) => updateItem(index, 'description', e.target.value)}
//                                             required
//                                         />
//                                     </div>
//                                     <div>
//                                         <div>
//                                             <label>כמות:</label>
//                                             <input
//                                                 type="number"
//                                                 value={item.quantity}
//                                                 onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
//                                                 min="1"
//                                                 required
//                                             />
//                                         </div>
//                                         <div>
//                                             <label>מחיר יחידה:</label>
//                                             <input
//                                                 type="number"
//                                                 value={item.unitPrice}
//                                                 onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
//                                                 min="0"
//                                                 step="0.01"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label>סוג:</label>
//                                         <select
//                                             value={item.type}
//                                             onChange={(e) => updateItem(index, 'type', e.target.value)}
//                                         >
//                                             <option value={BillingItemType.WORKSPACE}>Workspace</option>
//                                             <option value={BillingItemType.MEETING_ROOM}>Meeting Room</option>
//                                             <option value={BillingItemType.LOUNGE}>Lounge</option>
//                                             <option value={BillingItemType.SERVICE}>Service</option>
//                                             <option value={BillingItemType.DISCOUNT}>Discount</option>
//                                             <option value={BillingItemType.OTHER}>Other</option>
//                                         </select>
//                                     </div>
//                                     {formData.items.length > 1 && (
//                                         <Button
//                                             type="button"
//                                             onClick={() => removeItem(index)}
//                                         >
//                                             הסר פריט
//                                         </Button>
//                                     )}
//                                 </div>
//                             ))}
//                             {/* <Button
//                                 type="button"
//                                 onClick={addItem}
//                             >
//                                 הוסף פריט
//                             </Button> */}
//                         </div>

//                         <div>
//                             <Button
//                                 type="submit"
//                             >
//                                 {editingInvoice ? 'עדכן חשבונית' : 'צור חשבונית'}
//                             </Button>
//                             <Button
//                                 type="button"
//                                 onClick={resetForm}
//                             >
//                                 ביטול
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//             )}

//             <div>
//                 <h3>רשימת חשבוניות ({invoices && Array.isArray(invoices) ? invoices.length : 0})</h3>
//                 <div>
//                     <Table
//                         columns={columns}
//                         data={tableData}
//                         onUpdate={(invoice) => {
//                             handleEdit(invoice);
//                         }}
//                         onDelete={(invoice) => {
//                             if (invoice.id) {
//                                 handleDelete(invoice.id);
//                             }
//                         }}
//                     />

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InvoiceManagement;



import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '../invoice-generation-engine/invoiceStore';
import { InvoiceStatus, BillingItemType, CreateInvoiceRequest } from 'shared-types';
import { Table, TableColumn } from '../../../../Common/Components/BaseComponents/Table';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import Swal from 'sweetalert2';
import { UUID } from 'crypto';

// מחלקה שמכילה הצהרה ומימוש פונקציות לניהול החשבוניות
export const InvoiceManagement: React.FC = () => {

  const {
    invoices,
    loading,
    error,
    getAllInvoices,
    getAllInvoiceItems,
    createInvoice,
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    generateMonthlyInvoices,
    sendInvoiceByEmail,
    getOverdueInvoices,
    getInvoicesByStatus,
    calculateOpenInvoicesTotal,
    clearError
  } = useInvoiceStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>(InvoiceStatus.DRAFT);
  const [emailData, setEmailData] = useState({ invoiceId: '', email: '' });
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
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
    console.log(' קומפוננטה נטענת - מתחיל לשלוף חשבוניות');
    getAllInvoices();
  }, [getAllInvoices]);

  ///////////////
  const handleGetAllInvoiceItems = async (invoiceId: UUID) => {
    try {
      const response: any = await getAllInvoiceItems(invoiceId);
      if (Array.isArray(response.invoiceItems)) {
        if (response.invoiceItems.length === 0) {
          Swal.fire('אין פרטי חיוב', 'לא נמצאו פרטי חיוב לחשבונית זו', 'info');
        } else {
          setInvoiceItems(response.invoiceItems);
          Swal.fire({
            title: 'פריטי החשבונית',
            html: `
            <div style="max-height: 300px; overflow-y: auto;">
              ${response.invoiceItems.map((item: any) => `
                <div style="border: 1px solid #ddd; margin: 10px 0; padding: 10px;">
                  <p><strong>תיאור:</strong> ${item.description}</p>
                  <p><strong>כמות:</strong> ${item.quantity}</p>
                  <p><strong>מחיר יחידה:</strong> ₪${item.unit_price}</p>
                  <p><strong>מחיר יחידה:</strong> ₪${item.total_price}</p>
                  <p><strong>סוג:</strong> ${item.type}</p>
                </div>
              `).join('')}
            </div>
          `,
            width: 600,
            confirmButtonText: 'סגור'
          });
        }
      } else {
        console.error('הערך שהוחזר אינו מערך:', response);
        Swal.fire('שגיאה', 'התקבל מבנה נתונים לא צפוי מהשרת', 'error');
      }
    } catch (error) {
      console.error('שגיאה בקבלת פריטי החשבונית:', error);
      Swal.fire('שגיאה', 'אירעה שגיאה בטעינת פריטי החשבונית', 'error');
    }
  };
  // const handleGetAllInvoiceItems = async (invoiceId: UUID) => {
  //     try {
  //         const items = await getAllInvoiceItems(invoiceId);
  //         if (Array.isArray(items)) {
  //             setInvoiceItems(items);
  //             // הצג את הפריטים בחלון מודאלי או בצורה אחרת
  //             Swal.fire({
  //                 title: 'פריטי החשבונית',
  //                 html: `
  //                     <div style="max-height: 300px; overflow-y: auto;">
  //                         ${items.map((item: any) => `
  //                             <div style="border: 1px solid #ddd; margin: 10px 0; padding: 10px;">
  //                                 <p><strong>תיאור:</strong> ${item.description}</p>
  //                                 <p><strong>כמות:</strong> ${item.quantity}</p>
  //                                 <p><strong>מחיר יחידה:</strong> ₪${item.unitPrice}</p>
  //                                 <p><strong>סוג:</strong> ${item.type}</p>
  //                             </div>
  //                         `).join('')}
  //                     </div>
  //                 `,
  //                 width: 600,
  //                 confirmButtonText: 'סגור'
  //             });
  //         } else {
  //             console.error('הערך שהוחזר אינו מערך:', items);
  //             Swal.fire('שגיאה', 'התקבל מבנה נתונים לא צפוי מהשרת', 'error');
  //         }
  //     } catch (error) {
  //         console.error('שגיאה בקבלת פריטי החשבונית:', error);
  //         Swal.fire('שגיאה', 'אירעה שגיאה בטעינת פריטי החשבונית', 'error');
  //     }
  // };
  //////////////
  const columns: TableColumn<any>[] = [
    { header: 'מספר חשבונית', accessor: 'invoice_number' },
    { header: 'שם לקוח', accessor: 'customer_name' },
    { header: 'סטטוס', accessor: 'status' },
    { header: 'תאריך הנפקה', accessor: 'issue_date' },
    { header: 'תאריך פירעון', accessor: 'due_date' },
    {
      header: 'פרטי חיוב',
      accessor: 'getInvoiceItems',
      render: (value: any, row: any) => {
        return (
          <button onClick={() => handleGetAllInvoiceItems(row.id)}>
            פרטי חיוב
          </button>
        );
      }
    },
    { header: 'סכום ביניים', accessor: 'subtotal' },
    { header: 'מס', accessor: 'tax_total' },
    { header: 'תזכורת לתשלום נשלחה בתאריך', accessor: 'payment_due_reminder_sent_at' },
    { header: 'נוצר בתאריך', accessor: 'created_at' },
    { header: 'עודכן בתאריך', accessor: 'updated_at' },
  ];

  const tableData = (invoices && Array.isArray(invoices) ? invoices : []).map((invoice: any) => {
  const createdAt = invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('he-IL') : '';
  const updatedAt = invoice.updated_at ? new Date(invoice.updated_at).toLocaleDateString('he-IL') : '';

  return {
    ...invoice,
    issue_date: invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('he-IL') : '',
    due_date: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('he-IL') : '',
    subtotal: invoice.subtotal ? `₪${invoice.subtotal.toFixed(2)}` : '₪0.00',
    tax_total: invoice.taxtotal ? `₪${invoice.taxtotal.toFixed(2)}` : '₪0.00',
    status: invoice.status ? invoice.status.replace('_', ' ') : '',
    payment_due_reminder_sent_at: invoice.payment_dueReminder_sentAt ?
      new Date(invoice.payment_dueReminder_sentAt).toLocaleDateString('he-IL') : 'לא נשלחה',
    
    createdAt,
    updatedAt
  };
});

  const resetForm = () => {
    setFormData({
      customerId: '',
      customerName: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{
        description: '',
        quantity: 1,
        unitPrice: 0,
        type: BillingItemType.WORKSPACE
      }]
    });
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleEdit = async (invoice: any) => {
    try {
      const response: any = await getAllInvoiceItems(invoice.id);
      let invoiceItems = [];
      if (Array.isArray(response.invoiceItems)) {
        invoiceItems = response.invoiceItems;
      } else {
        console.error('הערך שהוחזר אינו מערך:', response);
        invoiceItems = [];
      }

      setEditingInvoice(invoice);
      const formDataForEdit = {
        customerId: invoice.customer_id || '',
        customerName: invoice.customer_name || '',
        issueDate: invoice.issue_date && !isNaN(new Date(invoice.issue_date).getTime())
          ? new Date(invoice.issue_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        dueDate: invoice.due_date && !isNaN(new Date(invoice.due_date).getTime())
          ? new Date(invoice.due_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        items: invoiceItems.length > 0
          ? invoiceItems.map((item: any) => ({
            id: item.id, // ✔ שמירת ID
            description: item.description || '',
            quantity: item.quantity || 1,
            unitPrice: item.unit_price || 0,
            type: item.type || BillingItemType.WORKSPACE
          }))
          : [{
            description: '',
            quantity: 1,
            unitPrice: 0,
            type: BillingItemType.WORKSPACE
          }]
      };

      const itemsHtml = formDataForEdit.items.map((item: any, index: number) => `
      <div id="item-${index}" style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px;">
        <h4>פריט ${index + 1}</h4>
        <div>
          <label>תיאור:</label>
          <input id="description-${index}" type="text" value="${item.description || ''}" required />
        </div>
        <div>
          <label>כמות:</label>
          <input id="quantity-${index}" type="number" value="${item.quantity || 1}" min="1" required />
        </div>
        <div>
          <label>מחיר יחידה:</label>
          <input id="unitPrice-${index}" type="number" value="${item.unitPrice || 0}" min="0" step="0.01" required />
        </div>
        <div>
  
          <label>סוג:</label>
          <select id="type-${index}">
            <option value="${BillingItemType.WORKSPACE}" ${item.type === BillingItemType.WORKSPACE ? 'selected' : ''}>Workspace</option>
            <option value="${BillingItemType.MEETING_ROOM}" ${item.type === BillingItemType.MEETING_ROOM ? 'selected' : ''}>Meeting Room</option>
            <option value="${BillingItemType.LOUNGE}" ${item.type === BillingItemType.LOUNGE ? 'selected' : ''}>Lounge</option>
            <option value="${BillingItemType.SERVICE}" ${item.type === BillingItemType.SERVICE ? 'selected' : ''}>Service</option>
            <option value="${BillingItemType.DISCOUNT}" ${item.type === BillingItemType.DISCOUNT ? 'selected' : ''}>Discount</option>
            <option value="${BillingItemType.OTHER}" ${item.type === BillingItemType.OTHER ? 'selected' : ''}>Other</option>
          </select>
        </div>
      </div>
    `).join('');

      const formHtml = `
      <div>
        <div>
          <label>מזהה לקוח:</label>
          <input id="customerId" type="text" value="${formDataForEdit.customerId || ''}" required />
        </div>
        <div>
          <label>שם לקוח:</label>
          <input id="customerName" type="text" value="${formDataForEdit.customerName || ''}" required />
        </div>
        <div>
          <label>תאריך הנפקה:</label>
          <input id="issueDate" type="date" value="${formDataForEdit.issueDate}" required />
        </div>
        <div>
          <label>תאריך פירעון:</label>
          <input id="dueDate" type="date" value="${formDataForEdit.dueDate}" required />
        </div>
        <div>
          <h3>פריטי החשבונית</h3>
          <div id="items-container">
            ${itemsHtml}
          </div>
        </div>
      </div>
    `;

      Swal.fire({
        title: 'עריכת חשבונית',
        html: `
  <div style="height: 350px; overflow-y: auto; direction: rtl;">
    ${formHtml}
  </div>
`,
        showCancelButton: true,
        confirmButtonText: 'עדכן חשבונית',
        cancelButtonText: 'ביטול',
        width: '800px',
        preConfirm: () => {
          const customerId = (document.getElementById('customerId') as HTMLInputElement).value;
          const customerName = (document.getElementById('customerName') as HTMLInputElement).value;
          const issueDate = (document.getElementById('issueDate') as HTMLInputElement).value;
          const dueDate = (document.getElementById('dueDate') as HTMLInputElement).value;

          if (!customerId || !customerName || !issueDate || !dueDate) {
            Swal.showValidationMessage('אנא מלא את כל השדות');
            return false;
          }
          const items = formDataForEdit.items.map((itemOrig: any, index: number) => ({
            id: itemOrig.id,
            description: (document.getElementById(`description-${index}`) as HTMLInputElement).value,
            quantity: parseInt((document.getElementById(`quantity-${index}`) as HTMLInputElement).value),
            unitPrice: parseFloat((document.getElementById(`unitPrice-${index}`) as HTMLInputElement).value),
            type: (document.getElementById(`type-${index}`) as HTMLSelectElement).value
          }));

          return {
            customerId,
            customerName,
            issueDate,
            dueDate,
            items
          };
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          const subtotal = result.value.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
          const taxAmount = subtotal * 0.17;
          const updateData = {
            customer_id: result.value.customerId,
            customer_name: result.value.customerName,
            issue_date: result.value.issueDate,
            due_date: result.value.dueDate,
            subtotal: subtotal,
            tax_total: Math.round(taxAmount),
            items: result.value.items.map((item: any) => ({
              id: item.id, // חשוב!
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              type: item.type
            }))
          };

          try {
            await updateInvoice(invoice.id, updateData);
            Swal.fire('הצלחה!', 'החשבונית עודכנה בהצלחה', 'success');
            setEditingInvoice(null);
          } catch (error) {
            console.error('שגיאה בעדכון חשבונית:', error);
            Swal.fire('שגיאה!', 'אירעה שגיאה בעדכון החשבונית', 'error');
          }
        }
      });

    } catch (error) {
      console.error('שגיאה בטעינת פריטי החשבונית:', error);
      Swal.fire('שגיאה', 'אירעה שגיאה בטעינת פריטי החשבונית', 'error');
    }
  };


  ///////////////////////////////

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * 0.17;

    try {
      if (editingInvoice) {
        const updateData = {
          customer_id: formData.customerId,
          customer_name: formData.customerName,
          issue_date: formData.issueDate,
          due_date: formData.dueDate,
          subtotal: subtotal,
          tax_total: taxAmount,
        };

        await updateInvoice(editingInvoice.id, updateData);
        console.log('חשבונית עודכנה בהצלחה');
      } else {
        const invoiceData: CreateInvoiceRequest = {
          customerId: formData.customerId,
          issueDate: formData.issueDate,
          dueDate: formData.dueDate,
          items: formData.items.map((item) => ({
            type: item.type,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: 17,
          })),
          notes: ''
        };
        await createInvoice(invoiceData);
        console.log('חשבונית נוצרה בהצלחה');
      }

      resetForm();
    } catch (error) {
      console.error('שגיאה בטיפול בחשבונית:', error);
    }
  };



  // const handleDelete = async (id: string) => {
  //   console.log('מתחיל מחיקה של חשבונית עם ID:', id);
  //   console.log('סוג המזהה:', typeof id);

  //   if (!window.confirm(`האם אתה בטוח שברצונך למחוק את החשבונית?`)) {
  //     return;
  //   }

  //   try {
  //     await deleteInvoice(id);
  //     console.log('חשבונית נמחקה בהצלחה');
  //   } catch (error) {
  //     console.error('שגיאה במחיקת חשבונית:', error);
  //   }
  // };
  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'מחיקת חשבונית',
        text: 'האם אתה בטוח שברצונך למחוק את החשבונית?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'מחק',
        cancelButtonText: 'ביטול',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      });

      if (!result.isConfirmed) return;

      await deleteInvoice(id);

      Swal.fire({
        title: 'הצלחה!',
        text: 'החשבונית נמחקה בהצלחה',
        icon: 'success',
        confirmButtonText: 'סגור'
      });

    } catch (error) {
      console.error('שגיאה במחיקת חשבונית:', error);
      Swal.fire({
        title: 'שגיאה!',
        text: 'אירעה שגיאה במחיקת החשבונית',
        icon: 'error',
        confirmButtonText: 'סגור'
      });
    }
  };


  return (
    <div className="invoice-management">
      <h1>ניהול חשבוניות</h1>
      <br />
      {error && (
        <div>
          שגיאה: {error}
          <Button onClick={clearError}>✕</Button>
        </div>
      )}

      {/* <div>
        <Button
          onClick={() => {
            if (showForm && !editingInvoice) {
              resetForm();
            } else {
              setShowForm(!showForm);
              setEditingInvoice(null);
            }
          }}
        >
          {showForm ? 'ביטול' : 'יצירת חשבונית חדשה'}
        </Button>
      </div> */}

      {showForm && (
        <div>
          <h3>{editingInvoice ? 'עריכת חשבונית' : 'יצירת חשבונית חדשה'}</h3>
          <form onSubmit={handleSubmit}>
            {/* ... (שאר הטופס נשאר ללא שינוי) ... */}
          </form>
        </div>
      )}

      <div>
        <h3>רשימת חשבוניות ({invoices && Array.isArray(invoices) ? invoices.length : 0})</h3>
        <div>
          <Table
            columns={columns}
            data={tableData}
            onUpdate={(invoice) => {
              handleEdit(invoice);
            }}
            onDelete={(invoice) => {
              if (invoice.id) {
                handleDelete(invoice.id);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;

