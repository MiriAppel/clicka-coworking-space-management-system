import React, { useState } from "react";
import { Button } from '../../../Common/Components/BaseComponents/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateCustomerRequest } from "../../../../types/customer";


export const InterestedCustomerRegistration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //המידע שאני מקבלת מהדף הקודם
    const lead = location.state?.data;

    const [showForm, setShowForm] = useState<boolean>(true);
    const [convertToCustomer, setConvertToCustomer]  = useState<CreateCustomerRequest>(
        //אם לאתחל אז יש למטה, או לא 
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        //בדיקת אימות כל הזמן ורק כאשר הטופס תקין ל
        setShowForm(false);
        //לקחת את כל הפרטים מהטופס ולשלוח אותם לשרת לשמירה כלקוח
        //שינוי הסטטוס של הליד
    }

    //כל הפרטים שחסר לי ואני צריכה למלא כי אין לי אותם עדיין
    // (פונקציית השואה בין מה שאני צריכה בעצם כל הפרטים שיש לי לכל לקוח לבין מה שיש לי ויביא לי רק את מה שאין לי ואני יצטרך למלא את זה .
    //אמור להיות טופס של כל הפרטים שחסר לי על המתעניין 
    //  <Button onClick={דף של החוזה} variant="primary" size="sm" >לינק לחוזה </Button>
    // וחוץ מזה כפתור שמעביר לחוזה
    //ברגע שאני עוברת לחוזה אני צריכה שיעבור איתי הפרטים שאני כבר יודעת וצריך אותם בחוזה שהמזכירה לא תצטרך לעבוד כפול 
    return <div className='interestedCustomerRegistration'>
        {/* כל עוד הטופס לא תקין רואים אותו ולאחר שליחה רואים את הדיב */}
        {showForm ?
            <div>
                <h1>רישום מתעניין ללקוח</h1>
                <h4>מלא את הפרטים החסרים</h4>
                <form onSubmit={handleSubmit}>
                    <button type="submit">שלח</button>
                </form>
            </div>
            :
            <div>
                <h2>הלקוח נרשם בהצלחה!</h2>
                <Button onClick={() => navigate(`/leadAndCustomer/customers/${lead.id}`)} variant="primary" size="sm">למעבר ללקוח שנוסף</Button>
            </div>}
        <p>מתעניין: {lead ? JSON.stringify(lead) : "לא נבחר מתעניין"}</p>

    </div>


}

// <label htmlFor="idFile">העלאת קובץ זיהוי:</label>
// <input type="file" id="idFile" name="idFile" accept=".jpg,.jpeg,.png,.pdf" />

//export interface Customer {
//   id: ID;
//   name: string;
//   phone: string;
//   email: string;
//   idNumber: string;
//   businessName: string;
//   businessType: string;
//   status: CustomerStatus;
//   currentWorkspaceType?: WorkspaceType;
//   workspaceCount: number;
//   contractSignDate?: DateISO;
//   contractStartDate?: DateISO;
//   billingStartDate?: DateISO;
//   notes?: string;
//   invoiceName?: string;
//   contractDocuments?: FileReference[];
//   paymentMethods: PaymentMethod[];
//   periods: CustomerPeriod[];
//   createdAt: DateISO;
//   updatedAt: DateISO;
// }

// export interface Lead {
//   id: ID;
//   name: string;
//   phone: string;
//   email: string;
//   businessType: string;
//   interestedIn: WorkspaceType[];
//   source: LeadSource;
//   status: LeadStatus;
//   contactDate?: DateISO;
//   followUpDate?: DateISO;
//   notes?: string;
//   interactions: LeadInteraction[];
//   createdAt: DateISO;
//   updatedAt: DateISO;
// }

// export interface CreateCustomerRequest {
//   name: string;
//   phone: string;
//   email: string;
//   idNumber: string;
//   businessName: string;
//   businessType: string;
//   workspaceType: WorkspaceType;
//   workspaceCount: number;
//   contractSignDate: DateISO;
//   contractStartDate: DateISO;
//   billingStartDate: DateISO;
//   notes?: string;
//   invoiceName?: string;
//   paymentMethod?: {
//     creditCardLast4?: string;
//     creditCardExpiry?: string;
//     creditCardHolderIdNumber?: string;
//     creditCardHolderPhone?: string;
//   };
//   contractDocuments?: FileReference[];
// }


// const createCustomerRequest: CreateCustomerRequest = {
//   name: lead.name,
//   phone: lead.phone,
//   email: lead.email,
//   idNumber: "", // ערך ברירת מחדל (לא קיים במתעניין)
//   businessName: "", // ערך ברירת מחדל (לא קיים במתעניין)
//   businessType: lead.businessType,
//   workspaceType: lead.interestedIn[0] || "defaultWorkspaceType", // ערך ברירת מחדל אם אין ערכים
//   workspaceCount: 1, // ערך ברירת מחדל
//   contractSignDate: new Date().toISOString(), // ערך ברירת מחדל
//   contractStartDate: new Date().toISOString(), // ערך ברירת מחדל
//   billingStartDate: new Date().toISOString(), // ערך ברירת מחדל
//   notes: lead.notes || "", // אם יש הערות, אחרת ערך ברירת מחדל
//   invoiceName: "", // ערך ברירת מחדל (לא קיים במתעניין)
//   paymentMethod: {
//     creditCardLast4: "", // ערך ברירת מחדל (לא קיים במתעניין)
//     creditCardExpiry: "", // ערך ברירת מחדל (לא קיים במתעניין)
//     creditCardHolderIdNumber: "", // ערך ברירת מחדל (לא קיים במתעניין)
//     creditCardHolderPhone: "", // ערך ברירת מחדל (לא קיים במתעניין)
//   },
//   contractDocuments: [] // ערך ברירת מחדל (לא קיים במתעניין)
// };