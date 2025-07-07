import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { NavLink } from "react-router";
import { ExportToExcel } from "../exportToExcel";
import {
  Table,
  TableColumn,
} from "../../../../Common/Components/BaseComponents/Table";
import { Customer, CustomerStatus } from "shared-types";
import { deleteCustomer } from "../../Service/LeadAndCustomersService";
import { Stack, TextField } from "@mui/material";
import axios from "axios";
import debounce from "lodash/debounce";
import { Pencil, Trash } from "lucide-react";
import { supabase } from "../../../../Service/supabaseClient";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { set } from "lodash";
import { text } from "body-parser";
// import { supabase } from "../../../../Services/supabaseClient";

interface ValuesToTable {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: CustomerStatus;
  businessName: string;
  businessType: string;
}

const statusLabels: Record<CustomerStatus, string> = {
  ACTIVE: "פעיל",
  NOTICE_GIVEN: "הודעת עזיבה",
  EXITED: "עזב",
  PENDING: "בהמתנה",
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
  // const [hasMore, setHasMore] = useState(true);

  //   const fetchCustomers = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await getAllCustomers();
  //       setCustomers(data);
  //     } catch (error) {
  //       console.error("Error fetching customers:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  const fetchCustomers = async (
    page: number,
    limit: number,
    searchTerm = ""
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/customers/by-page",
        {
          params: { page, limit },
        }
      );

      const data: Customer[] = response.data;

      // setHasMore(data.length === limit); // אם פחות מה-limit, אין עוד דפים

      // תמיד להחליף את הסטייט בתוצאות הדף בלבד (לא להוסיף)
      setCustomers(data);
      allCustomersRef.current = data;
    } catch (error) {
      console.error("שגיאה ב-fetchCustomers:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      fetchCustomers(page, 20, "");
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchCustomers(page, 20, searchTerm).then(() => {
      console.log(
        "✅ אחרי fetchCustomers - כמות לקוחות ב־allCustomers:",
        allCustomersRef.current.length
      );
    });
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current || isSearching) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isSearching]);

  // useEffect(() => {
  //   // fetchCustomers();
  //   // האזנה לשינויים בטבלת customers
  //   const channel = supabase
  //     .channel('public:customer')
  //     .on(
  //       'postgres_changes',
  //       { event: '*', schema: 'public', table: 'customer' },
  //       (payload) => {
  //         // כל שינוי (הוספה, עדכון, מחיקה) יגרום לרענון הרשימה
  //         fetchCustomers();
  //       }
  //     )
  //     .subscribe();

  //   // ניקוי מאזין כשיוצאים מהקומפוננטה
  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, []);

  useEffect(() => {
    if (!loaderRef.current || isSearching) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isSearching]);

  // הפונקציה שמטפלת בשינוי החיפוש
 const handleSearch = (term: string) => {
  setTerm(term);
  setSearchTerm(term);

  if (!term.trim()) {
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




  const getValuseToTable = (): ValuesToTable[] => {
    return customers.map((customer) => ({
      id: customer.id!,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      businessName: customer.businessName || "לא זמין",
      businessType: customer.businessType || "לא זמין",
      status: customer.status,
    }));
  };

  const columns: TableColumn<ValuesToTable>[] = [
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
    try {
      await deleteCustomer(val.id)
      // await fetchCustomers();
      setCustomers((prev) => prev.filter(customer => customer.id !== val.id));
      allCustomersRef.current = allCustomersRef.current.filter((customer) => customer.id !== val.id);
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
      {isLoading ? (
        <h2 className="text-3xl font-bold text-center text-blue-600 my-4">
          טוען...
        </h2>
      ) : (
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
          <Table<ValuesToTable>
            data={getValuseToTable()}
            columns={columns}
            onDelete={deleteCurrentCustomer}
            onUpdate={editCustomer}
            renderActions={(row) => (
              <>
                {/* <NavLink
                  to={`:${row.id}/dashboard`}
                  className="text-blue-500 hover:underline ml-2"
                >
                  לוח בקרה
                </NavLink>
                <NavLink
                  to={`:${row.id}/contract`}
                  className="text-blue-500 hover:underline ml-2"
                >
                  חוזה לקוח
                </NavLink> */}
                <Button
                  onClick={() => navigate(`:${row.id}`, { state: { data: customers.find(c => c.id == row.id) } })}
                  variant="primary"
                  size="sm"
                >
                  פרטי הלקוח
                </Button>
              </>
            )}
          />{" "}
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => {
              if (page > 1) {
                const prevPage = page - 1;
                setPage(prevPage);
                fetchCustomers(prevPage, 20, "");
              }
            }}
          >
            דף הקודם
          </Button>
          <Button
            variant="secondary"
            // disabled={!hasMore}
            onClick={() => {
              // if (hasMore) {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchCustomers(nextPage, 20, "");
              // }
            }}
          >
            דף הבא
          </Button>
          <div ref={loaderRef} className="h-4"></div>
        </div>
      )}
    </>
  );
};
