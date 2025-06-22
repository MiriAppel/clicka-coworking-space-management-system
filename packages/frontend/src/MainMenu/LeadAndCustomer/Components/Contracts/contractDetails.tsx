import { useParams } from "react-router";
import { useState } from "react";
import { Contract, ContractStatus, WorkspaceType } from "../../../../types/customer"
import { Button } from '../../../Common/Components/BaseComponents/Button';

export const ContractDetails = () => {
    //מקבלים את החוזה לפי מזהה הלקוח, אפשר לשנות לפי מזהה החוזה
    const { customerId } = useParams();

    // דוגמה בלבד לחוזה עם ערכים התחלתיים. יש לעשות קריאת שרת לקבל את החוזה.
    const [currentContract, setCurrentContract] = useState<Contract>({
        id: "default-contract-id",
        customerId: customerId || "",
        version: 1,
        status: ContractStatus.ACTIVE,
        signDate: new Date().toISOString() as any,
        startDate: new Date().toISOString() as any,
        endDate: new Date().toISOString() as any,
        terms: {
            workspaceType: WorkspaceType.DESK_IN_ROOM,
            workspaceCount: 1,
            monthlyRate: 1,
            duration: 1, // months
            renewalTerms: "Automatic renewal unless terminated",
            terminationNotice: 1,// days
        },
        documents: [{
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
        // modifications: ContractModification[]; //חסר הישות ContractModification!! 
        signedBy: "John Doe",
        witnessedBy: "Jane Smith",
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,

    })

    const editContract = () => {
        //כאן יפתח טופס למילוי הפרטים האפשריים לעריכה
        //צריך להפעיל קריאת שרת לעדכון חוזה (אם קיים כזה דבר) ולעדכן את הנתונים בהתאם
    }

    return (
        //     {/*  כאן מוצגים כל הפרטים של החוזה עבור לקוח מסוים */}

        <div className="contract-details">
            <h2 className="text-xl font-bold mb-4">פרטי החוזה</h2>
            <Button variant="primary" size="sm" onClick={() => editContract()}>ערוך</Button>
            <p><strong>ID:</strong> {currentContract.id}</p>
            <p><strong>מזהה לקוח:</strong> {currentContract.customerId}</p>
            <p><strong>גרסה:</strong> {currentContract.version}</p>
            <p><strong>סטטוס:</strong> {currentContract.status}</p>
            {currentContract.signDate && <p><strong>תאריך חתימה:</strong> {new Date(currentContract.signDate).toLocaleDateString()}</p>}
            <p><strong>תאריך התחלה:</strong> {new Date(currentContract.startDate).toLocaleDateString()}</p>
            {currentContract.endDate && <p><strong>תאריך סיום:</strong> {new Date(currentContract.endDate).toLocaleDateString()}</p>}
            <h3>תנאים</h3>
            <p><strong>סוג מקום עבודה:</strong> {currentContract.terms.workspaceType}</p>
            <p><strong>מספר מקומות עבודה:</strong> {currentContract.terms.workspaceCount}</p>
            <p><strong>תעריף חודשי:</strong> {currentContract.terms.monthlyRate} ₪</p>
            <p><strong>משך:</strong> {currentContract.terms.duration} חודשים</p>
            <p><strong>תנאי חידוש:</strong> {currentContract.terms.renewalTerms}</p>
            <p><strong>הודעת סיום:</strong> {currentContract.terms.terminationNotice} ימים</p>
            <h3>מסמכים</h3>
            <ul>
                {currentContract.documents.map(doc => (
                    <li key={doc.id}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a> - {doc.size / 1024} KB
                    </li>
                ))}
            </ul>
            {currentContract.signedBy && <p><strong>חתום על ידי:</strong> {currentContract.signedBy}</p>}
            {currentContract.witnessedBy && <p><strong>עדי:</strong> {currentContract.witnessedBy}</p>}
            <p><strong>נוצר בתאריך:</strong> {new Date(currentContract.createdAt).toLocaleDateString()}</p>
            <p><strong>עודכן בתאריך:</strong> {new Date(currentContract.updatedAt).toLocaleDateString()}</p>
        </div>
    );
}