import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { getAllContracts, deleteContract} from "../../Service/LeadAndCustomersService";
import { Contract, ContractStatus, ID } from "shared-types";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";

// טיפוס פנימי לתצוגת טבלה
interface ValuesToTable {
  id: ID;
  customerId: ID;
  customerName: string;
  status: string;
  startDate: string;
  workspaceCount: number;
}

// תרגום סטטוסים לעברית
const statusLabels: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: "טיוטה",
  [ContractStatus.PENDING_SIGNATURE]: "ממתין לחתימה",
  [ContractStatus.SIGNED]: "נחתם",
  [ContractStatus.ACTIVE]: "פעיל",
  [ContractStatus.EXPIRED]: "פג תוקף",
  [ContractStatus.TERMINATED]: "הסתיים",
};

// פונקציית עזר לפורמט תאריך
const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};


export const ContractManagement = () => {
  const navigate = useNavigate();
  type ContractWithCustomerName = Contract & {
    customerName: string;
  };
  const [contracts, setContracts] = useState<ContractWithCustomerName[]>([]);

  // שליפת כל החוזים מהשרת
  useEffect(() => {
    getAllContracts()
      .then((dataFromServer) => {
        const converted = dataFromServer.map((c: any) => ({
          id: c.id,
          customerId: c.customerId ?? "",
          version: c.version,
          status: c.status,
          signDate: c.signDate,
          startDate: c.startDate ?? "",
          endDate: c.endDate,
          terms: c.terms, 
          documents: c.documents,
          signedBy: c.signedBy,
          witnessedBy: c.witnessedBy,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          customerName: c.customerName ?? "",
        }));
        setContracts(converted);        
      })
      .catch((err) => console.error("שגיאה בטעינת חוזים:", err));
  }, []);

  const valuesToTable: ValuesToTable[] = contracts.map((contract) => ({
    id: contract.id ?? "",
    customerId: contract.customerId ?? "",
    customerName: contract.customerName,
    status: statusLabels[contract.status],
    startDate: formatDate(contract.startDate),
    workspaceCount: contract.terms?.workspaceCount ?? 0,
  }));

  // הגדרת עמודות הטבלה
  const columns: TableColumn<ValuesToTable>[] = [
    { header: "שם לקוח", accessor: "customerName" },
    { header: "סטטוס", accessor: "status" },
    { header: "תאריך התחלה", accessor: "startDate" },
    { header: "כמות עמדות", accessor: "workspaceCount" },
  ];

const handleDeleteContract = (row: ValuesToTable) => {
  if (!window.confirm("האם אתה בטוח שברצונך למחוק את החוזה?")) return;
  deleteContract(row.id)
    .then(() => {
      setContracts((prev) => prev.filter((c) => c.id !== row.id));
      showAlert("מחיקה", "החוזה נמחק בהצלחה", "success");
    })
    .catch((err) => {console.log("שגיאה במחיקת חוזה:", err), showAlert("מחיקה", "שגיאה במחיקת חוזה", "error")});
};

  const handleUpdateContract = (val: ValuesToTable) => {
    navigate(`edit/${val.id}`, { state: { customerName: val.customerName } });
  };

  // פעולות לכל שורה בטבלה
  const renderActions = (row: ValuesToTable) => (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={() => navigate(`customer/${row.customerId}`, { state: { customerName: row.customerName } })}>
        פרטי חוזה
      </Button>
    </div>
  );

  return (
    <div className="p-6" dir="rtl">

      <Button
        variant="primary"
        size="md"
        onClick={() => navigate("addContract")}
        dir="rtl"
        data-testid="add-contract-button"
      >
        הוספת חוזה חדש
      </Button>

      <h2 className="text-3xl font-bold text-center text-blue-600 my-4">
        ניהול חוזים
      </h2>

      <Table<ValuesToTable>
        data={valuesToTable}
        columns={columns}
        onDelete={handleDeleteContract}
        onUpdate={handleUpdateContract}
        renderActions={renderActions}
      />
    </div>
  );
}