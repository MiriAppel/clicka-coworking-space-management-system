import { useLocation, useParams } from "react-router";
import { NavLink, Outlet, Link } from "react-router";
import { useState } from "react";
import type{ Customer } from "shared-types";
import { CustomerStatus, WorkspaceType, PaymentMethodType, ExitReason } from "shared-types";
import { Button } from "../../../../Common/Components/BaseComponents/Button";

//לא צריך את העמוד הזה!!!!
//בגלל שכבר פונים מהטבלה על ידי עריכה לפרטים...

export const CustomerDetails = () => {
    const { customerId } = useParams();

    const location = useLocation();

    // המידע שאני מקבלת מהדף הקודם - או לעשות קריאת שרת שמקבלת לקוח בודד לפי מזהה
    const customer: Customer = location.state?.data;

    const editCustomer = () => {
        
        //כאן יפתח טופס למילוי הפרטים האפשריים לעריכה
        //מאותחל בכל הפרטים הנוכחחים עם אפשרות לשנות
        //צריך להפעיל קריאת שרת של עריכת לקוח ולעדכן בהתאם את הנתונים
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-primary text-center mb-4">פרטי לקוח</h2>
            <div className="grid grid-cols-2 gap-4">
                <div><strong>שם:</strong> {customer.name}</div>
                <div><strong>טלפון:</strong> {customer.phone}</div>
                <div><strong>אימייל:</strong> {customer.email}</div>
                <div><strong>מספר תעודת זהות:</strong> {customer.idNumber}</div>
                <div><strong>שם עסק:</strong> {customer.businessName}</div>
                <div><strong>סוג עסק:</strong> {customer.businessType}</div>
                <div><strong>סטטוס:</strong> {customer.status}</div>
                <div><strong>סוג מקום עבודה נוכחי:</strong> {customer.currentWorkspaceType}</div>
                <div><strong>מספר מקומות עבודה:</strong> {customer.workspaceCount}</div>
                <div><strong>תאריך חתימה על חוזה:</strong> {customer.contractSignDate}</div>
                <div><strong>תאריך התחלה של חוזה:</strong> {customer.contractStartDate}</div>
                <div><strong>תאריך התחלה של חיוב:</strong> {customer.billingStartDate}</div>
                <div><strong>הערות:</strong> {customer.notes}</div>
                <div><strong>שם חשבונית:</strong> {customer.invoiceName}</div>
                {/* <div><strong>שיטות תשלום:</strong> {customer.paymentMethods?.join(', ')}</div> */}
                <div><strong>סוג תשלום:</strong> {customer.paymentMethodType}</div>
                {/* <div><strong>תקופות:</strong> {customer.periods?.join(', ')}</div> */}
                <div><strong>נוצר בתאריך:</strong> {customer.createdAt}</div>
                <div><strong>עודכן בתאריך:</strong> {customer.updatedAt}</div>
            </div>
        </div>
            );
}

        //         <Button variant="primary" size="sm" onClick={() => editCustomer()}>ערוך</Button><br />
        //         <Link to="dashboard" className="text-blue-500 hover:underline">ללוח הבקרה של הלקוח</Link><br />
        //         <Link to="contract" className="text-blue-500 hover:underline">לחוזה הלקוח</Link>


                // {/* <h3 className="mt-4 text-lg font-semibold">מסמכי חוזה</h3>
                // {customer.contractDocuments && customer.contractDocuments.map(doc => (
                //     <div key={doc.id}>
                //         <p><strong>שם מסמך:</strong> {doc.name}</p>
                //         <p><strong>כתובת URL:</strong> <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{doc.url}</a></p>
                //     </div>
                // ))} */}
{/* 
                <h3 className="mt-4 text-lg font-semibold">שיטות תשלום</h3>
                {customer.paymentMethods && customer.paymentMethods.map(method => (
                    <div key={method.id}>
                        <p><strong>מספר כרטיס אשראי (4 ספרות אחרונות):</strong> {method.creditCardLast4}</p>
                        <p><strong>תאריך תפוגה:</strong> {method.creditCardExpiry}</p>
                    </div>
                ))}

                <h3 className="mt-4 text-lg font-semibold">תקופות</h3>
                { customer.periods && customer.periods.map(period => (
                    <div key={period.id} >
                        <p><strong>תאריך כניסה:</strong> {new Date(period.entryDate).toLocaleDateString()}</p>
                        {period.exitDate && <p><strong>תאריך יציאה:</strong> {new Date(period.exitDate).toLocaleDateString()}</p>}
                        <p><strong>סיבת יציאה:</strong> {period.exitReasonDetails}</p>
                    </div>
                ))} */}

                {/* צריך להוסיף לינקים לחוזים ואינטרקציות */}
        

//     );
// }