import { useParams } from "react-router";
import { NavLink, Outlet, Link } from "react-router";
import { useState } from "react";
import '../../Css/customerDetails.css';
import { CustomerStatus, WorkspaceType, PaymentMethodType, ExitReason , Customer } from "shared-types";
import { Button } from "../../../../Common/Components/BaseComponents/Button";

//לא צריך את העמוד הזה!!!!
//בגלל שכבר פונים מהטבלה על ידי עריכה לפרטים...

export const CustomerDetails = () => {
    const { customerId } = useParams();

    //דוגמא ללקוח בודד
    // כאן יהיה קריאת שרת לקבלת לקוח בודד עפי מזהה לקוח או שיקבלו אותו ישירות מהקומפוננטה של כל הלקוחות 
    // ויכנס למשתנה זה 
    const [customer, setCustomer] = useState<Customer>({
        id: customerId || "", //האם זה מבטא את מזהה הלקוח או המזהה של הDB 
        name: "John Doe",
        phone: "0555555555",
        email: "exapmle@gmail.com",
        idNumber: customerId || "", // האם זה מזהה הלקוח
        businessName: "Example Business",
        businessType: "Retail",
        status: CustomerStatus.ACTIVE,
        currentWorkspaceType: WorkspaceType.DESK_IN_ROOM,
        workspaceCount: 1,
        contractSignDate: new Date().toISOString() as any,
        contractStartDate: new Date().toISOString() as any,
        billingStartDate: new Date().toISOString() as any,
        notes: "This is a sample customer note.",
        invoiceName: "Example Invoice",
        contractDocuments: [{
            id: "",
            name: "Contract Document",
            path: "/documents/contract.pdf",
            mimeType: "application/pdf",
            size: 102400, // 100 KB;
            url: "https://example.com/documents/contract.pdf",
            googleDriveId: "12345",
            createdAt: new Date().toISOString() as any,
            updatedAt: new Date().toISOString() as any,
        }],
        paymentMethodsType:PaymentMethodType.CREDIT_CARD,
        paymentMethods: [{
            id: "",
            customerId: customerId || "",
            creditCardLast4: "1234",
            creditCardExpiry: "12/25",
            creditCardHolderIdNumber: "123456789",
            creditCardHolderPhone: "0555555555",
            isActive: true,
            createdAt: new Date().toISOString() as any,
            updatedAt: new Date().toISOString() as any,
        }],
        periods: [{
            id: "",
            customerId: customerId || "",
            entryDate: new Date().toISOString() as any,
            exitDate: new Date().toISOString() as any,
            exitNoticeDate: new Date().toISOString() as any,
            exitReason: ExitReason.BUSINESS_CLOSED,
            exitReasonDetails: "Business closed due to financial issues.",
            createdAt: new Date().toISOString() as any,
            updatedAt: new Date().toISOString() as any,
        }
        ],
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
    })

    const editCustomer = () => {
        //כאן יפתח טופס למילוי הפרטים האפשריים לעריכה
        //מאותחל בכל הפרטים הנוכחחים עם אפשרות לשנות
        //צריך להפעיל קריאת שרת של עריכת לקוח ולעדכן בהתאם את הנתונים
    }

    return (
        <div className="customer-page p-5">
            <div className="customer-details">
                <h2 className="text-xl font-bold mb-4">פרטי הלקוח</h2>
                <Button variant="primary" size="sm" onClick={() => editCustomer()}>ערוך</Button><br />
                <Link to="dashboard" className="text-blue-500 hover:underline">ללוח הבקרה של הלקוח</Link><br />
                <Link to="contract" className="text-blue-500 hover:underline">לחוזה הלקוח</Link>

                <p><strong>שם:</strong> {customer.name}</p>
                <p><strong>טלפון:</strong> {customer.phone}</p>
                <p><strong>אימייל:</strong> {customer.email}</p>
                <p><strong>מספר תעודת זהות:</strong> {customer.idNumber}</p>
                <p><strong>שם עסק:</strong> {customer.businessName}</p>
                <p><strong>סוג עסק:</strong> {customer.businessType}</p>
                <p><strong>סטטוס:</strong> {customer.status}</p>
                <p><strong>מספר מקומות עבודה:</strong> {customer.workspaceCount}</p>
                {customer.contractSignDate && <p><strong>תאריך חתימה על חוזה:</strong> {new Date(customer.contractSignDate).toLocaleDateString()}</p>}
                {customer.contractStartDate && <p><strong>תאריך התחלת חוזה:</strong> {new Date(customer.contractStartDate).toLocaleDateString()}</p>}
                {customer.billingStartDate && <p><strong>תאריך התחלת חיוב:</strong> {new Date(customer.billingStartDate).toLocaleDateString()}</p>}
                <p><strong>הערות:</strong> {customer.notes}</p>

                <h3 className="mt-4 text-lg font-semibold">מסמכי חוזה</h3>
                {customer.contractDocuments && customer.contractDocuments.map(doc => (
                    <div key={doc.id}>
                        <p><strong>שם מסמך:</strong> {doc.name}</p>
                        <p><strong>כתובת URL:</strong> <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{doc.url}</a></p>
                    </div>
                ))}

                <h3 className="mt-4 text-lg font-semibold">שיטות תשלום</h3>
                {customer.paymentMethods.map(method => (
                    <div key={method.id}>
                        <p><strong>מספר כרטיס אשראי (4 ספרות אחרונות):</strong> {method.creditCardLast4}</p>
                        <p><strong>תאריך תפוגה:</strong> {method.creditCardExpiry}</p>
                    </div>
                ))}

                <h3 className="mt-4 text-lg font-semibold">תקופות</h3>
                {customer.periods.map(period => (
                    <div key={period.id} >
                        <p><strong>תאריך כניסה:</strong> {new Date(period.entryDate).toLocaleDateString()}</p>
                        {period.exitDate && <p><strong>תאריך יציאה:</strong> {new Date(period.exitDate).toLocaleDateString()}</p>}
                        <p><strong>סיבת יציאה:</strong> {period.exitReasonDetails}</p>
                    </div>
                ))}

                {/* צריך להוסיף לינקים לחוזים ואינטרקציות */}
            </div>
        </div>

    );
}