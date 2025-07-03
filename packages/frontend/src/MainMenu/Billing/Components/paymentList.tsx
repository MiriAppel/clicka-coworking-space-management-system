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
  const [getAllPayments, setAllPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/payment/by-page", {
        params: { page, limit: 50 },
      })
      .then((response) => {
        if (response.data.length < 50) {
          setHasMore(false);
          // אין יותר נתונים
        }
        setPayment((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const uniqueNew = response.data.filter(
            (payment: Payment) => !ids.has(payment.id)
          );
          return [...prev, ...uniqueNew];
        });
        // עדכון המאגר הכללי של הלקוחות
        setAllPayments((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const uniqueNew = response.data.filter(
            // מסנן תשלומים שלא קיימים כבר במאגר הכללי
            (payment: Payment) => !ids.has(payment.id)
          );
          return [...prev, ...uniqueNew];
        });
      })

      .catch((error) => {
        console.log("error in paymentList page", error);

        console.error("Error fetching leads:", error);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore || isSearching) return;

    // ברגע שהתשללומים עומדים להגמר זה עובר לעמוד הבא
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isSearching]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term || term.trim() === "") {
      setIsSearching(false);
      setPage(1); // זה יגרום ל-useEffect לטעון את הדף הראשון
      setPayment([]); // מרוקן את הקיימים כדי שיטען מחדש
      setHasMore(true);
      return;
    }

    setIsSearching(true);

    // סינון תומך באותיות קטנות וגדולות
    // מחפש גם לפי שם, פלאפון ודוא"ל
    // אם לא מצא תוצאות, שולח בקשה לשרת
    const filtered = getAllPayments.filter(
      (payment) =>
        payment.id?.toLowerCase().includes(term.toLowerCase()) ||
        payment.customer_name?.toLowerCase().includes(term.toLowerCase()) ||
        payment.amount?.toString().includes(term) ||
        payment.method?.toLowerCase().includes(term.toLowerCase()) ||
        payment.invoice_number?.toLowerCase().includes(term.toLowerCase()) ||
        payment.date?.toLowerCase().includes(term.toLowerCase())
    );

    if (filtered.length > 0) {
      setPayment(filtered);
    } else {
      axios
        .get("http://localhost:3001/api/payment/filter", {
          params: { q: term, page: 1, limit: 50 },
        })
        .then((response) => {
          setPayment(response.data);
        })
        .catch((error) => {
          console.error("Error searching from server:", error);
        });
    }
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
                if (e.key === "Enter") {
                  handleSearch(searchTerm);
                }
              }}
            />
          </Stack>

          <br />

          <Table<ValuesToTable>
            data={getValuseToTable()}
            columns={columns}
            onDelete={() => {}}
            onUpdate={() => {}}
            renderActions={(row) => (
              <>
                <NavLink
                  to={`/${row.id}/dashboard`}
                  className="text-blue-500 hover:underline ml-2"
                >
                  לוח בקרה
                </NavLink>
                <NavLink
                  to={`/${row.id}/contract`}
                  className="text-blue-500 hover:underline ml-2"
                >
                  חוזה לקוח
                </NavLink>
              </>
            )}
          />

          <div ref={loaderRef} className="h-4"></div>
        </div>
      )}
    </>
  );
};