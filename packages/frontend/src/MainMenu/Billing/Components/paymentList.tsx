import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import { Payment } from "shared-types";
import axios from "axios";
import debounce from "lodash/debounce";
import {
  Table,
  TableColumn,
} from "../../../Common/Components/BaseComponents/Table";
import { NavLink } from "react-router";

import { Stack, TextField } from "@mui/material";
import { Button } from "../../../Common/Components/BaseComponents/Button";

interface ValuesToTable {
  id: string;
  customer_name: string;
  amount: number;
  method: string;
  invoice_number?: string;
  date: string;
}

// const statusLabels: Record<CustomerStatus, string> = {
//   ACTIVE: "פעיל",
//   NOTICE_GIVEN: "הודעת עזיבה",
//   EXITED: "עזב",
//   PENDING: "בהמתנה",
// };

export const PaymentList = () => {
  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<Payment[]>([]);
  const allPaymentsRef = useRef<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPayment = async (
    page: number,
    limit: number,
    searchTerm = ""
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/payment/by-page",
        {
          params: { page, limit },
        }
      );

      const data: Payment[] = response.data;

      // setHasMore(data.length === limit); // אם פחות מה-limit, אין עוד דפים

      // תמיד להחליף את הסטייט בתוצאות הדף בלבד (לא להוסיף)
      setPayment(data);
      allPaymentsRef.current = data;
    } catch (error) {
      console.error("שגיאה ב-fetchPayment:", error);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
    fetchPayment(page, 20, searchTerm).then(() => {
      console.log(
        "✅ אחרי fetchPayment - כמות לקוחות ב־allPayment:",
        allPaymentsRef.current.length
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
  //   fetchCustomers();
  //   // האזנה לשינויים בטבלת customers
  //   const channel = supabase
  //     .channel('public:customer')
  //     .on(
  //       'postgres_changes',
  //       { event: '*', schema: 'public', table: 'customers' },
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

  //   const handleDeleteCustomer = (id: string) => {
  //     setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  //     setAllCustomers((prev) => prev.filter((customer) => customer.id !== id)); // גם מהמאגר הכללי
  //   };

  const handleSearch = (term: string) => {
  setTerm(term);
  setSearchTerm(term);

  if (!term.trim()) {
    // אם ריק, מחזירים לתצוגה רגילה
    setIsSearching(false);
    fetchPayment(page, 20, "");
    return;
  }

  setIsSearching(true);
  const lower = term.toLowerCase();

const filtered = allPaymentsRef.current.filter(
  (c) =>
    c.customer_name?.toLowerCase().includes(lower) ||
    c.customer_id?.toLowerCase().includes(lower) ||
    c.invoice_number?.toLowerCase().includes(lower) ||
    c.amount?.toString().toLowerCase().includes(lower)
);


  setPayment(filtered);
};


  //   const handleDeleteCustomer = (id: string) => {
  //     setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  //     setAllCustomers((prev) => prev.filter((customer) => customer.id !== id)); // גם מהמאגר הכללי
  //   };

  const getValuseToTable = (): ValuesToTable[] => {
    return payment
      .filter((p) => !!p.id) // מסנן רשומות שאין להן id
      .map((p) => ({
        id: p.id!, // הבטחה שהוא קיים אחרי הסינון
        customer_name: p.customer_name || "—",
        amount: p.amount || 0,
        method: p.method,
        invoice_number: p.invoice_number || "—",
        date: new Date(p.date).toLocaleDateString("he-IL"),
      }));
  };

  const columns: TableColumn<ValuesToTable>[] = [
    { header: "לקוח", accessor: "customer_name" },
    { header: "סכום", accessor: "amount" },
    { header: "שיטה", accessor: "method" },
    { header: "מספר חשבונית", accessor: "invoice_number" },
    { header: "תאריך", accessor: "date" },
  ];

  const debouncedSearch = useRef(
    debounce((value: string) => handleSearch(value), 400)
  ).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    setSearchTerm(value);
    debouncedSearch(value);
  };

  function deleteCurrentPayment(row: ValuesToTable): void {
    throw new Error("Function not implemented.");
  }

  function editCustomer(row: ValuesToTable): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {isLoading ? (
        <h2 className="text-3xl font-bold text-center text-blue-600 my-4">
          טוען...
        </h2>
      ) : (
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center text-blue-600 my-4">
            תשלומים
          </h2>

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
                  payment.length === 0 // אין תוצאות בדף הנוכחי
                ) {
                  console.log("🔍 חיפוש בשרת עם המחרוזת:", searchTerm);

                  axios
                    .get("http://localhost:3001/api/payment/search", {
                      params: { text: searchTerm },
                    })
                    .then((response) => {
                      const data: Payment[] = response.data.map(
                        (item: any) => ({
                          ...item,
                          invoiceNumber: item.invoice_number,
                          customerName: item.customer_name,
                        })
                      );

                      setPayment(data);
                      allPaymentsRef.current = data;
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
            onDelete={deleteCurrentPayment}
            onUpdate={editCustomer}
            renderActions={(row) => (
              <>
                <NavLink
                  to={`:${row.id}/dashboard`}
                  className="text-blue-500 hover:underline ml-2"
                >
                  לוח בקרה
                </NavLink>
              
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
                fetchPayment(prevPage, 20, "");
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
              fetchPayment(nextPage, 20, "");
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
