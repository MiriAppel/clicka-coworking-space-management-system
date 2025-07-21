import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import {
  Table,
  TableColumn,
} from "../../../../Common/Components/BaseComponents/Table";
import {
  getAllContracts,
  deleteContract,
} from "../../Service/LeadAndCustomersService";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { Contract, ContractStatus, ID } from "shared-types";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { useContractStore } from "../../../../Stores/LeadAndCustomer/contractsStore";
import { ShowAlertWarn } from "../../../../Common/Components/showAlertWarn";

// טיפוס פנימי לתצוגת טבלה
interface ValuesToTable {
  id: ID;
  customerId: ID;
  customerName: string;
  status: string;
  startDate: string;
  endDate: string;
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
const formatDate = (iso?: string) =>
  iso ? new Date(iso).toISOString().split("T")[0].split("-").reverse().join("/") : "";

export const ContractManagement = () => {
  const navigate = useNavigate();
  type ContractWithCustomerName = Contract & {
    customerName: string;
  };
  const contracts = useContractStore(state => state.contracts) as ContractWithCustomerName[];
  const [activeTab, setActiveTab] = useState<"all" | "endingSoon">("all");
  const {fetchContracts, fetchContractsEndingSoon, handleDeleteContract} = useContractStore();

  useEffect(() => {
    fetchContracts().catch((err) =>
      console.error("שגיאה בטעינת חוזים:", err)
    );
  }, []);

  const loadAllContracts = () => {
    fetchContracts().catch((err) =>
      console.error("שגיאה בטעינת כל החוזים:", err)
    );
  };

  const loadContractsEndingSoon = () => {
    fetchContractsEndingSoon(30).catch((err) =>
      console.error("שגיאה בטעינת חוזים שתוקפם עומד להסתיים:", err)
    );
  };
  const latestContractsMap = new Map<string, ContractWithCustomerName>();

  contracts.forEach(contract => {
    const existing = latestContractsMap.get(contract.customerId);
    const currentStart = contract.startDate ? new Date(contract.startDate) : null;
    const existingStart = existing?.startDate ? new Date(existing.startDate) : null;

    if (!existing || (currentStart && existingStart && currentStart > existingStart)) {
      latestContractsMap.set(contract.customerId, contract);
    }
  });

  const valuesToTable: ValuesToTable[] = Array.from(latestContractsMap.values()).map(contract => ({
    id: contract.id ?? "",
    customerId: contract.customerId ?? "",
    customerName: contract.customerName,
    status: statusLabels[contract.status],
    startDate: formatDate(contract.startDate),

    endDate: formatDate(contract.endDate),
    workspaceCount: contract.terms?.workspaceCount ?? 0,
  }));
  // הגדרת עמודות הטבלה
  const columns: TableColumn<ValuesToTable>[] = [
    { header: "שם לקוח", accessor: "customerName" },
    { header: "סטטוס", accessor: "status" },
    { header: "תאריך התחלה", accessor: "startDate" },
    { header: "תאריך סיום", accessor: "endDate" },
    { header: "כמות עמדות", accessor: "workspaceCount" },
  ];

  //מחיקת חוזה
  const deleteContract = async (row: ValuesToTable) => {
    const confirmed = await ShowAlertWarn('האם אתה בטוח שברצונך למחוק את החוזה לצמיתות?', 'לא ניתן לשחזר את המידע לאחר מחיקה.');

    if (confirmed) {
      await handleDeleteContract(row.id)
        .then(() => {
          showAlert("מחיקה", "החוזה נמחק בהצלחה", "success");
        })
        .catch((err) => {
          console.log("שגיאה במחיקת חוזה:", err);
          showAlert("מחיקה", "שגיאה במחיקת חוזה", "error");
        });
    }
  };

  //עדכון חוזה
  const updateContract = (val: ValuesToTable) => {
    navigate(`edit/${val.id}`, { state: { customerName: val.customerName } });
  };

  const renderActions = (row: ValuesToTable) => (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={() => navigate(`customer/${row.customerId}`, { state: { customerName: row.customerName } })}>
        פרטי חוזים
      </Button>
    </div>
  );

  return (
    <div className="p-6" dir="rtl">


      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-600">ניהול חוזים</h2>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate("addContract")}
          data-testid="add-contract-button"
        >
          הוספת חוזה חדש
        </Button>
      </div>

      <div className="flex gap-4 border-b mb-6">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
          onClick={() => {
            setActiveTab("all");
            loadAllContracts();
          }}
        >
          כל החוזים
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === "endingSoon" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
          onClick={() => {
            setActiveTab("endingSoon");
            loadContractsEndingSoon();
          }}
        >
          חוזים שתוקפם יסתיים בקרוב
        </button>
      </div>

      <Table<ValuesToTable>
        data={valuesToTable}
        columns={columns}

        onDelete={deleteContract}
        onUpdate={updateContract}
        renderActions={renderActions}
      />
    </div>
  );
}
