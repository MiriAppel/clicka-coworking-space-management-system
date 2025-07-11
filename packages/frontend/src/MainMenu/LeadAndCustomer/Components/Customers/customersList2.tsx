import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { NavLink } from "react-router";
import { ExportToExcel } from "../exportToExcel";
import {
  Table,
  TableColumn,
} from "../../../../Common/Components/BaseComponents/Table";
import { Customer, CustomerStatus, DateISO, PaymentMethodType, WorkspaceType } from "shared-types";
import { deleteCustomer } from "../../Service/LeadAndCustomersService";
import { Stack, TextField } from "@mui/material";
import axios from "axios";
import debounce from "lodash/debounce";
import { Pencil, Trash } from "lucide-react";
import { supabase } from "../../../../Service/supabaseClient";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { set } from "lodash";
import { text } from "body-parser";
import { showAlertHTML } from "../../../../Common/Components/BaseComponents/showAlertHTML";
import { ShowAlertWarn } from "../../../../Common/Components/showAlertWarn";

interface ValuesToTable {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: CustomerStatus;
  businessName: string;
  businessType: string;
  image: string;
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
};

const PaymentMethodTypeLabels: Record<PaymentMethodType, string> = {
  CREDIT_CARD: 'כרטיס אשראי',
  BANK_TRANSFER: 'העברה בנקאית',
  CHECK: 'שיק',
  CASH: 'מזומן',
  OTHER: 'אחר',
};

export const CustomersList = () => {
  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const allCustomersRef = useRef<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCustomers = async (
    page: number,
    limit: number,
    searchTerm = ""
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/customers/page",
        {
          params: { page, limit },
        }
      );

      const data: Customer[] = response.data;

      setHasMore(data.length === limit); // אם פחות מה-limit, אין עוד דפים
      setCustomers(data);
      allCustomersRef.current = data;
    } catch (error) {
      console.error("שגיאה ב-fetchCustomers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (searchTerm.trim() === "") {
  //     setIsSearching(false);
  //     fetchCustomers(page, 20, "");
  //   }
  // }, [searchTerm]);

  useEffect(() => {
    console.log("in useefect", page);
    // if (searchTerm != "")
    fetchCustomers(page, 20, searchTerm).then(() => {
      console.log(
        "✅ אחרי fetchCustomers - כמות לקוחות ב־allCustomers:",
        allCustomersRef.current.length
      );
    });
  }, [page]);


  //צריך בשביל זה גישה
  //  useEffect(() => {
  //       const channel = supabase
  //         .channel('public:customer')
  //         .on(
  //           'postgres_changes',
  //           { event: '*', schema: 'public', table: 'customer' },
  //           (payload) => {
  //             console.log('Change detected:', payload); // הוסף לוג כדי לבדוק אם האירועים מתקבלים
  //             fetchCustomers(page, 20, ""); // ודא שהפונקציה זו מוגדרת
  //           }
  //         )
  //         .subscribe();

  //       return () => {
  //         supabase.removeChannel(channel);
  //       };
  //   }, []);

  // הפונקציה שמטפלת בשינוי החיפוש
  const handleSearch = (term: string) => {
    setTerm(term);
    setSearchTerm(term);

    if (!term.trim()) {
      console.log("in not term", page);
      // אם ריק, מחזירים לתצוגה רגילה
      setIsSearching(false);
      fetchCustomers(page, 20, "");
      return;
    }

    setIsSearching(true);
    const lower = term.toLowerCase();

    const filtered = allCustomersRef.current.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.phone.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower) ||
        c.businessName?.toLowerCase().includes(lower) ||
        c.businessType?.toLowerCase().includes(lower) ||
        statusLabels[c.status].toLowerCase().includes(lower)
    );

    setCustomers(filtered);
  };

  const showCustomerDetailsAlert = (row: ValuesToTable) => {
    const customer = customers.find(c => c.id == row.id)!
    const customerDetailsHtml = `<img
            src="${row.image}"
            alt="Customer Image"
            class="mt-5 w-32 h-32 rounded-full border-2 border-gray-300 mx-auto"
            />
            <div style="text-align: center; margin: 20px;">
        <strong style="font-size: 24px;">${customer.name || ''}</strong> <br>
    </div>
     <div style="margin: 20px; text-align: right;">
    <strong>טלפון:</strong> ${customer.phone || ''}<br>
    <strong>אימייל:</strong> ${customer.email || ''}<br>
    <strong>מספר תעודת זהות:</strong> ${customer.idNumber || ''}<br>
    <strong>שם עסק:</strong> ${customer.businessName || ''}<br>
    <strong>סוג עסק:</strong> ${customer.businessType || ''}<br>
    <strong>סטטוס:</strong> ${statusLabels[customer.status as CustomerStatus] || customer.status || ''}<br>
    <strong>סוג מקום עבודה נוכחי:</strong> ${workspaceTypeLabels[customer.currentWorkspaceType as WorkspaceType] || customer.currentWorkspaceType || ''}<br>
    <strong>מספר מקומות עבודה:</strong> ${customer.workspaceCount || ''}<br>
    <strong>תאריך חתימה על חוזה:</strong> ${formatDate(customer.contractSignDate!)}<br>
    <strong>תאריך התחלה של חוזה:</strong> ${formatDate(customer.contractStartDate!)}<br>
    <strong>תאריך התחלה של חיוב:</strong> ${formatDate(customer.billingStartDate!)}<br>
    <strong>הערות:</strong> ${customer.notes || ''}<br>
    <strong>שם חשבונית:</strong> ${customer.invoiceName || ''}<br>
    <strong>סוג תשלום:</strong> ${PaymentMethodTypeLabels[customer.paymentMethodType as PaymentMethodType] || customer.paymentMethodType || ''}<br>
    <strong>נוצר בתאריך:</strong> ${formatDate(customer.createdAt)}<br>
    <strong>עודכן בתאריך:</strong> ${formatDate(customer.updatedAt)}<br>
 <a href="contracts/${row.id}" class="text-blue-500 hover:underline ml-2">חוזה</a>
    </div>`;

    showAlertHTML(customerDetailsHtml); // לא מעביר אייקון


  };


  const getValuseToTable = (): ValuesToTable[] => {
    return customers.map((customer) => ({
      id: customer.id!,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      businessName: customer.businessName,
      businessType: customer.businessType,
      status: customer.status,
      image: "https://images.pexels.com/photos/2072162/pexels-photo-2072162.jpeg",  //לקחת את התמונה של הלקוח מהדרייב
    }));
  };

  const columns: TableColumn<ValuesToTable>[] = [
    {
      header: "",
      accessor: "image",
      render: (value, row) => (
        <div className="flex justify-center">
          <img
            src={value}
            alt="Customer Image"
            className="w-10 h-10 rounded-full object-cover transition duration-200 ease-in-out border-2 border-transparent hover:border-blue-500 cursor-pointer"
            onClick={() => showCustomerDetailsAlert(row)} />
        </div>),
    },
    { header: "שם", accessor: "name" },
    { header: "פלאפון", accessor: "phone" },
    { header: "מייל", accessor: "email" },
    {
      header: "סטטוס",
      accessor: "status",
      render: (value, row) => (
        <div className="flex justify-between items-center">
          {statusLabels[row.status as CustomerStatus] || row.status}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`updateStatus/${row.id}`)}
          >
            <Pencil size={10} />
          </Button>
        </div>
      ),
    },
    { header: "שם העסק", accessor: "businessName" },
    { header: "סוג עסק", accessor: "businessType" },
  ];

  const deleteCurrentCustomer = async (val: ValuesToTable) => {
    const confirmed = await ShowAlertWarn('האם אתה בטוח שברצונך למחוק את הלקוח לצמיתות?', 'לא ניתן לשחזר את המידע לאחר מחיקה.');

    if (confirmed) {
      try {
        await deleteCustomer(val.id)
        await fetchCustomers(page, 20, "");
        // setCustomers((prev) => prev.filter(customer => customer.id !== val.id));
        // allCustomersRef.current = allCustomersRef.current.filter((customer) => customer.id !== val.id);
        showAlert("מחיקה", "לקוח נמחק בהצלחה", "success");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data);
          showAlert("שגיאה במחיקת לקוח", `שגיאה מהשרת: ${error.response?.data.error.details || 'שגיאה לא ידועה'}`, "error");
        } else {
          // טיפול בשגיאות אחרות
          console.error('Unexpected error:', error);
          showAlert("שגיאה במחיקת לקוח", 'שגיאה בלתי צפויה', "error");
        }
        // showAlert("שגיאה", `מחיקת לקוח נכשלה\n${error}`, "error");
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
    // console.log("value", value);

    setTerm(value);
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const translateStatus = (status: CustomerStatus): string => {
    switch (term) {
      case "פעיל":
        return CustomerStatus.ACTIVE;
      case "הודעת עזיבה":
        return CustomerStatus.NOTICE_GIVEN;
      case "עזב":
        return CustomerStatus.EXITED;
      case "בהמתנה":
        return CustomerStatus.PENDING;
      default:
        return status; // מחזיר את הסטטוס המקורי אם לא נמצא ת
    }
  };

  return (
    <>

      <div className="p-6">
        <h2 className="text-3xl font-bold text-center text-blue-600 my-4">
          לקוחות
        </h2>
        <ExportToExcel data={customers} fileName="לקוחות" />
        <br />
        <br />
        <Stack spacing={2} direction="row">
          <TextField
            label="חיפוש"
            fullWidth
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" && searchTerm.trim()) ||
                customers.length === 0 // אין תוצאות בדף הנוכחי
              ) {
                console.log("🔍 חיפוש בשרת עם המחרוזת:", searchTerm);

                axios
                  .get("http://localhost:3001/api/customers/search", {
                    params: { text: searchTerm },
                  })
                  .then((response) => {
                    const data: Customer[] = response.data.map(
                      (item: any) => ({
                        ...item,
                        businessName: item.business_name,
                        businessType: item.business_type,
                      })
                    );

                    setCustomers(data);
                    allCustomersRef.current = data;
                    console.log("✅ תוצאות שהגיעו מהשרת:", data.length);
                  })
                  .catch((error) => {
                    console.error("שגיאה בחיפוש מהשרת:", error);
                  });
              }
            }}
          />
        </Stack>
        <br />

        <div className="relative">

          <Table<ValuesToTable>
            data={getValuseToTable()}
            columns={columns}
            onDelete={deleteCurrentCustomer}
            onUpdate={editCustomer}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
              <div className="loader border-8 border-gray-300 border-t-8 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></div> {/* גלגל טעינה */}
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-4 my-4">
          <Button
            variant={page > 1 ? "secondary" : "accent"}
            disabled={page <= 1}
            onClick={() => {
              if (page > 1) {
                const prevPage = page - 1;
                setPage(prevPage);
                fetchCustomers(prevPage, 20, "");
              }
            }}
          >
            <span>❮❮</span> הקודם
          </Button>
          <Button
            variant={hasMore ? "secondary" : "accent"}
            disabled={!hasMore}
            onClick={() => {
              if (hasMore) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchCustomers(nextPage, 20, "");
              }
            }}
          >
            הבא <span>❯❯</span>
          </Button>
        </div>
        <div ref={loaderRef} className="h-4"></div>

      </div>

    </>
  );
};

const formatDate = (dateString: DateISO) => {
  if (!dateString) return 'לא זמין'; // אם התאריך ריק, מחזירים 'לא זמין'

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // יום
  const month = String(date.getMonth() + 1).padStart(2, '0'); // חודש (מתחילים מ-0)
  const year = String(date.getFullYear()).slice(-2); // שנה (שני תווים אחרונים)

  return `${day}/${month}/${year}`; // מחזירים בפורמט DD/MM/YY
};