import { Table, TableColumn } from '../../../../Common/Components/BaseComponents/Table';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
// import { showAlert } from '../../../../Common/Components/BaseComponents/ShowAlert';
import { EmailTemplate } from 'shared-types';
import { useEffect, useState } from 'react';
import { UpdateEmailTemplate } from './UpdateEmailTemplate';
import { AddEmailTemplate } from './AddEmailTemplate';
import { useEmailTemplateStore } from '../../../../Stores/CoreAndIntegration/emailTemplateStore';

export const EmailTemplateTable = () => {
  const {
    emailTemplates,
    loading,
    error,
    getEmailTemplates,
    deleteEmailTemplate,
  } = useEmailTemplateStore();

  const [showUpdateEmailTemplate, setShowUpdateEmailTemplate] = useState(false);
  const [showAddEmailTemplate, setShowAddEmailTemplate] = useState(false);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    getEmailTemplates();
  }, [getEmailTemplates]);

  const handleUpdate = (emailTemplate: EmailTemplate) => {
    setSelectedEmailTemplate(emailTemplate);
    setShowUpdateEmailTemplate(true);
  };

  const handleDelete = async (emailTemplate: EmailTemplate) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את ${emailTemplate.name}?`)) {
      try {
        await deleteEmailTemplate(emailTemplate.id as string);
        // showAlert("", "תבנית המייל נמחקה בהצלחה", "success");
        alert("תבנית המייל נמחקה בהצלחה");
      } catch (error) {
        console.error("Error deleting email template:", error);
        // showAlert("שגיאה", "מחיקת תבנית המייל נכשלה. נסה שוב", "error");
        alert("מחיקת תבנית המייל נכשלה. נסה שוב");
      }
    }
  };

  const handleAddEmailTemplate = () => {
    setShowAddEmailTemplate(true);
  };

  const handleCloseModals = () => {
    setShowUpdateEmailTemplate(false);
    setShowAddEmailTemplate(false);
    setSelectedEmailTemplate(null);
  };

  const handleEmailTemplateUpdated = () => {
    getEmailTemplates(); // רענון הרשימה
    handleCloseModals();
  };

  const handlePreview = (emailTemplate: EmailTemplate) => {
    // כאן ניתן להוסיף לוגיקה להצגת תצוגה מקדימה של תבנית הדוא"ל
    console.log("Previewing email template:", emailTemplate);
  }


  const emailTemplateColumns: TableColumn<EmailTemplate>[] = [
    { header: "שם", accessor: "name" },
    { header: "נושא", accessor: "subject" },
    { header: "גוף HTML", accessor: "bodyHtml" },
    { header: "גוף הטקסט", accessor: "bodyText" },
    { header: "שפה", accessor: "language" },
    { header: "משתנים", accessor: "variables"}
    // { header: "משתנים", accessor: "variables", render: (value: string[]) => value.join(', ') }
    // {
    //     header: "פעולות",
    //     render: (emailTemplate: EmailTemplate) => (
    //         <div>
    //             <Button onClick={() => handleUpdate(emailTemplate)}>Update</Button>
    //             <Button onClick={() => handlePreview(emailTemplate)}>Preview</Button>
    //             <Button onClick={() => handleDelete(emailTemplate)}>Delete</Button>
    //         </div>
    //     )
    // }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">טוען תבניות דוא"ל...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          שגיאה: {error}
        </div>
      </div>
    );
  }

  // אם מציגים טופס הוספה או עדכון
  if (showAddEmailTemplate) {
    return (
      <AddEmailTemplate
        onClose={handleCloseModals}
        onEmailTemplateAdded={handleEmailTemplateUpdated}
      />
    );
  }

  if (showUpdateEmailTemplate && selectedEmailTemplate) {
    return (
      <UpdateEmailTemplate
        emailTemplate={selectedEmailTemplate}
        onClose={handleCloseModals}
        onEmailTemplateUpdated={handleEmailTemplateUpdated}
      />
    );
  }

  return (
    <div className="p-6">
      {/* כותרת וכפתור הוספה */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ניהול תבניות דוא"ל</h2>
        <Button
          variant="primary"
          onClick={handleAddEmailTemplate}
          className="flex items-center gap-2"
        >
          <span>+</span>
          הוסף תבנית דוא"ל חדשה
        </Button>
      </div>

      {/* סטטיסטיקות
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Total Email Tsemplates: <span className="font-semibold">{emailTemplates.length}</span>
          {" | "}
          Active Users: <span className="font-semibold">
            {users.filter(user => user.active).length}
          </span>
        </div>
      </div> */}

      {/* טבלת תבניות מייל */}
      <Table<EmailTemplate>
        data={emailTemplates}
        columns={emailTemplateColumns}
        dir="rtl"
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};