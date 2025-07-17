import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { ExportToExcel } from "../exportToExcel";
import { Stack, TextField } from "@mui/material";
import debounce from "lodash/debounce";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { ShowAlertWarn } from "../../../../Common/Components/showAlertWarn";
import { useCustomerStore } from "../../../../Stores/LeadAndCustomer/customerStore";
import { ExpandableCustomerCard } from "../../../../Common/Components/BaseComponents/ExpandableCard";

import {
  CustomerStatus,
  DateISO,
  PaymentMethodType,
  WorkspaceType,
} from "shared-types";

interface ValuesToTable {
  id: string;
}

const statusLabels: Record<CustomerStatus, string> = {
  ACTIVE: "פעיל",
  NOTICE_GIVEN: "הודעת עזיבה",
  EXITED: "עזב",
  PENDING: "בהמתנה",
};

const workspaceTypeLabels: Record<WorkspaceType, string> = {
  PRIVATE_ROOM: 'חדר פרטי',
  DESK_IN_ROOM: 'שולחן בחדר',
  OPEN_SPACE: 'אופן ספייס',
  KLIKAH_CARD: 'כרטיס קליקה',
  DOOR_PASS: 'דלת כניסה',
  WALL: 'קיר',
  COMPUTER_STAND: 'עמדת מחשב',
  RECEPTION_DESK: 'דלפק קבלה',
};

const PaymentMethodTypeLabels: Record<PaymentMethodType, string> = {
  CREDIT_CARD: 'כרטיס אשראי',
  BANK_TRANSFER: 'העברה בנקאית',
  CHECK: 'שיק',
  CASH: 'מזומן',
  OTHER: 'אחר',
};

const formatDate = (dateString: DateISO | undefined) => {
  if (!dateString) return "לא זמין";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

export const CustomersList = () => {
  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");

  const {
    customers,
    deleteCustomer,
    loading,
    currentPage,
    limit,
    searchCustomersByText,
    fetchCustomersByPage,
    searchCustomersInPage,
    fetchNextPage,
    fetchPrevPage,
  } = useCustomerStore();

  useEffect(() => {
    fetchCustomersByPage();
  }, [fetchCustomersByPage]);

  const handleSearch = (term: string) => {
    searchCustomersInPage(term);
  };

  const deleteCurrentCustomer = async (val: ValuesToTable) => {
    const confirmed = await ShowAlertWarn(
      "האם אתה בטוח שברצונך למחוק את הלקוח לצמיתות?",
      "לא ניתן לשחזר את המידע לאחר מחיקה."
    );

    if (confirmed) {
      await deleteCustomer(val.id);
      showAlert("מחיקה", "לקוח נמחק בהצלחה", "success");
      const latestError = useCustomerStore.getState().error;
      if (latestError) {
        const errorMessage = latestError || "שגיאה בלתי צפויה";
        console.error("Error:", errorMessage);
        showAlert("שגיאה במחיקת לקוח", errorMessage, "error");
      }
    }
  };

  const editCustomer = (val: ValuesToTable) => {
    const selected = customers.find((c) => c.id === val.id);
    navigate("update", { state: { data: selected } });
  };

  const debouncedSearch = useRef(
    debounce((value: string) => handleSearch(value), 400)
  ).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const searchInApi = async (e: { key: string }) => {
    if (
      (e.key === "Enter" && searchTerm.trim()) ||
      customers.length === 0
    ) {
      await searchCustomersByText(searchTerm);
    }
  };

  const getCardData = () => {
    return customers.map((c) => ({
      id: c.id!,
      name: c.name,
      phone: c.phone,
      email: c.email,
      businessName: c.businessName,
      businessType: c.businessType,
      status: c.status,
      idNumber: c.idNumber,
      currentWorkspaceType: c.currentWorkspaceType,
      workspaceCount: c.workspaceCount,
      contractSignDate: c.contractSignDate,
      contractStartDate: c.contractStartDate,
      billingStartDate: c.billingStartDate,
      notes: c.notes,
      invoiceName: c.invoiceName,
      paymentMethodType: c.paymentMethodType,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 my-4">
        לקוחות
      </h2>

    <div className="flex items-center gap-4 mb-4">
  <Button variant="primary" size="sm" onClick={() => navigate("new")} className="flex gap-1 items-center">
    ➕ הוספת לקוח חדש
  </Button>
  <ExportToExcel data={customers} fileName="לקוחות" />
</div>

      <br />
      <Stack spacing={2} direction="row">
        <TextField
          label="חיפוש"
          fullWidth
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={searchInApi}
        />
      </Stack>

      <div className="relative mt-6">
        <div className="grid gap-4">
          {getCardData().map((customer) => (
            <ExpandableCustomerCard
              key={customer.id}
              {...customer}
              onEdit={() => editCustomer({ id: customer.id })}
              onDelete={() => deleteCurrentCustomer({ id: customer.id })}
            />
          ))}
        </div>

        {loading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="loader border-8 border-gray-300 border-t-8 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></div>
          </div>
        )}
      </div>


      <div className="flex justify-center space-x-4 my-4">
        <Button
          variant={currentPage > 1 ? "secondary" : "accent"}
          disabled={currentPage <= 1}
          onClick={async () => {
            if (currentPage > 1) {
              await fetchPrevPage();
            }
          }}
        >
          <span>❮❮</span> הקודם
        </Button>
        <Button
          variant={customers.length === limit ? "secondary" : "accent"}
          disabled={customers.length < limit}
          onClick={async () => {
            if (customers.length === limit) {
              await fetchNextPage();
            }
          }}
        >
          הבא <span>❯❯</span>
        </Button>
      </div>

      <div ref={loaderRef} className="h-4"></div>
    </div>
  );
};
