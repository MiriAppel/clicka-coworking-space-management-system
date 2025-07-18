
import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '../../../../Stores/Billing/invoiceStore';
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
    { header: 'עודכן בתאריך', accessor: 'updated_at' }
  ];

  const tableData = (invoices && Array.isArray(invoices) ? invoices : []).map((invoice, index) => {

    return {
      ...invoice,
      issue_date: invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('he-IL') : '',
      due_date: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('he-IL') : '',
      subtotal: invoice.subtotal ? `₪${invoice.subtotal.toFixed(2)}` : '₪0.00',
      tax_total: invoice.taxtotal ? `₪${invoice.taxtotal.toFixed(2)}` : '₪0.00',
      status: invoice.status ? invoice.status.replace('_', ' ') : '',
      payment_due_reminder_sent_at: invoice.payment_dueReminder_sentAt ?
        new Date(invoice.payment_dueReminder_sentAt).toLocaleDateString('he-IL') : 'לא נשלחה',
      created_at: invoice.created_at ? invoice.created_at : '',
      updated_at: invoice.updated_at ? invoice.updated_at : '',

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
            id: itemOrig.id, // 👈 קריטי!
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

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSendEmail = async () => {
    if (!emailData.invoiceId || !emailData.email) return;

    try {
      await sendInvoiceByEmail(emailData.invoiceId, emailData.email);
      setEmailData({ invoiceId: '', email: '' });
    } catch (error) {
      console.error('שגיאה בשליחת מייל:', error);
    }
  };

  const handleStatusUpdate = async (invoiceId: string, status: InvoiceStatus) => {
    try {
      await updateInvoiceStatus(invoiceId, status);
    } catch (error) {
      console.error('שגיאה בעדכון סטטוס:', error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('מתחיל מחיקה של חשבונית עם ID:', id);
    console.log('סוג המזהה:', typeof id);

    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את החשבונית?`)) {
      return;
    }

    try {
      await deleteInvoice(id);
      console.log('חשבונית נמחקה בהצלחה');
    } catch (error) {
      console.error('שגיאה במחיקת חשבונית:', error);
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

      <div>
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
      </div>

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

