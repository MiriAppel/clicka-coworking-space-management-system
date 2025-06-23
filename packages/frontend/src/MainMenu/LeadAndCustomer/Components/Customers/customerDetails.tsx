import { useParams } from "react-router";
import { NavLink, Outlet, Link } from "react-router";
import { useState } from "react";
import { Customer, CustomerStatus, WorkspaceType, ExitReason } from "../../../../types/customer";
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import '../../Css/customerDetails.css';


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
        //צריך להפעיל קריאת שרת של עריכת לקוח ולעדכן בהתאם את הנתונים
    }

    return (
        <div className="customer-page">
            <div className="customer-details">
                <h2>פרטי הלקוח</h2>
                <Button variant="primary" size="sm" onClick={() => editCustomer()}>ערוך</Button><br />
                <Link to="dashboard">ללוח הבקרה של הלקוח</Link><br />{/* האם זה אמור להיות כאן? */}
                <Link to="contract">לחוזה הלקוח</Link>
                <p><strong>שם:</strong> {customer.name}</p>
                <p><strong>טלפון:</strong> {customer.phone}</p>
                <p><strong>אימייל:</strong> {customer.email}</p>
                <p><strong>מספר תעודת זהות:</strong> {customer.idNumber}</p>
                <p><strong>שם עסק:</strong> {customer.businessName}</p>
                <p><strong>סוג עסק:</strong> {customer.businessType}</p>
                <p><strong>סטטוס:</strong> {customer.status}</p>
                <p><strong>מספר מקומות עבודה:</strong> {customer.workspaceCount}</p>
                <p><strong>תאריך חתימה על חוזה:</strong> {customer.contractSignDate}</p>
                <p><strong>תאריך התחלת חוזה:</strong> {customer.contractStartDate}</p>
                <p><strong>תאריך התחלת חיוב:</strong> {customer.billingStartDate}</p>
                <p><strong>הערות:</strong> {customer.notes}</p>
                <h3>מסמכי חוזה</h3>
                {customer.contractDocuments && customer.contractDocuments.map(doc => (
                    <div key={doc.id}>
                        <p><strong>שם מסמך:</strong> {doc.name}</p>
                        <p><strong>כתובת URL:</strong> <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.url}</a></p>
                    </div>
                ))}
                <h3>שיטות תשלום</h3>
                {customer.paymentMethods.map(method => (
                    <div key={method.id}>
                        <p><strong>מספר כרטיס אשראי (4 ספרות אחרונות):</strong> {method.creditCardLast4}</p>
                        <p><strong>תאריך תפוגה:</strong> {method.creditCardExpiry}</p>
                    </div>
                ))}
                <h3>תקופות</h3>
                {customer.periods.map(period => (
                    <div key={period.id}>
                        <p><strong>תאריך כניסה:</strong> {period.entryDate}</p>
                        <p><strong>תאריך יציאה:</strong> {period.exitDate}</p>
                        <p><strong>סיבת יציאה:</strong> {period.exitReasonDetails}</p>
                    </div>
                ))}

            
                {/* צריך להוסיף לינקים לחוזים ואינטרקציות */}
            </div>
        </div>
    );
}