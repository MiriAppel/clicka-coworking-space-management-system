import { useLocation, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Contract, ContractStatus, FileReference, WorkspaceType } from "shared-types";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { fetchContractByCustomerId } from "../../Service/LeadAndCustomersService";

const statusLabels: Record<ContractStatus, string> = {
    DRAFT: "טיוטה",
    PENDING_SIGNATURE: "ממתין לחתימה",
    SIGNED: "חתום",
    ACTIVE: "פעיל",
    EXPIRED: "פג תוקף",
    TERMINATED: "הסתיים",
};

const workspaceTypeLabels: Record<WorkspaceType, string> = {
    PRIVATE_ROOM: "חדר פרטי",
    DESK_IN_ROOM: "שולחן בחדר",
    OPEN_SPACE: "עמדה במרחב פתוח",
    KLIKAH_CARD: "כרטיס קליקה",
    DOOR_PASS: "כרטיס כניסה",
    WALL: "קיר",
    RECEPTION_DESK: "דלפק קבלה",
    COMPUTER_STAND: "עמדת מחשב",
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const ContractDetails = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const [contract, setContract] = useState<Contract | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const customerName = location.state?.customerName ?? "  לא ידוע";
    const navigate = useNavigate();

    useEffect(() => {
        if (!customerId) {
            setError("לא נמצא מזהה לקוח.");
            setLoading(false);
            return;
        }

        fetchContractByCustomerId(customerId)
            .then(setContract)
            .catch(() => setError("שגיאה בשליפת פרטי החוזה."))
            .finally(() => setLoading(false));
    }, [customerId]);

    if (loading) return <p className="text-center text-gray-600">טוען פרטי חוזה...</p>;
    if (error) return <p className="text-red-600 text-center">{error}</p>;
    if (!contract) return <p className="text-center">לא נמצאו פרטי חוזה להצגה.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-blue-700">פרטי חוזה</h2>
                <Button variant="primary" size="sm" onClick={() => {navigate(`/leadAndCustomer/contracts/edit/${contract.id}`, { state: { customerName: customerName } });}}>ערוך</Button>
            </div>

            {/* פרטי בסיס */}
            <div className="bg-white rounded-lg shadow p-4 space-y-2">
                {/* <div><strong>מזהה חוזה:</strong> {contract.id}</div>
                <div><strong>מזהה לקוח:</strong> {contract.customerId}</div> */}
                <div><strong>שם לקוח:</strong> {customerName}</div>
                <div><strong>גרסה:</strong> {contract.version}</div>
                <div><strong>סטטוס:</strong> {statusLabels[contract.status]}</div>
                {contract.signDate && <div><strong>תאריך חתימה:</strong> {formatDate(contract.signDate)}</div>}
                {contract.startDate && <div><strong>תאריך התחלה:</strong> {formatDate(contract.startDate)}</div>}
                {contract.endDate && <div><strong>תאריך סיום:</strong> {formatDate(contract.endDate)}</div>}
            </div>

            {/* תנאים */}
            <div className="bg-gray-50 rounded-lg shadow p-4 mt-6">
                <h3 className="text-lg font-semibold mb-2">תנאי חוזה</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><strong>סוג מקום עבודה:</strong> {contract.terms?.workspaceType !== undefined ? workspaceTypeLabels[contract.terms.workspaceType] : "—"}</div>
                    <div><strong>מספר עמדות:</strong> {contract.terms?.workspaceCount ?? "—"}</div>
                    <div><strong>תעריף חודשי:</strong> {contract.terms?.monthlyRate ?? "—"} ₪</div>
                    <div><strong>משך חודשים:</strong> {contract.terms?.duration ?? "—"}</div>
                    <div><strong>תנאי חידוש:</strong> {contract.terms?.renewalTerms ?? "—"}</div>
                    <div><strong>הודעת סיום:</strong> {contract.terms?.terminationNotice ?? "—"} ימים</div>
                </div>
            </div>

            {/* מסמכים */}
            <div className="bg-white rounded-lg shadow p-4 mt-6">
                <h3 className="text-lg font-semibold mb-2">מסמכים</h3>
                {(contract.documents ?? []).length > 0 ? (
                    <ul className="list-disc pr-5 space-y-1">
                        {contract.documents.map((doc: FileReference) => (
                            <li key={doc.id}>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    {doc.name}
                                </a>{" "}
                                – {Math.round(doc.size / 1024)} KB
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">אין מסמכים.</p>
                )}
            </div>

            {/* חתימות וזמנים */}
            <div className="bg-gray-100 rounded-lg shadow p-4 mt-6 space-y-1">
                {contract.signedBy && <p><strong>חתום על ידי:</strong> {contract.signedBy}</p>}
                {contract.witnessedBy && <p><strong>עד/ה:</strong> {contract.witnessedBy}</p>}
                <p><strong>נוצר בתאריך:</strong> {formatDate(contract.createdAt)}</p>
                <p><strong>עודכן בתאריך:</strong> {formatDate(contract.updatedAt)}</p>
            </div>
        </div>
    );
};