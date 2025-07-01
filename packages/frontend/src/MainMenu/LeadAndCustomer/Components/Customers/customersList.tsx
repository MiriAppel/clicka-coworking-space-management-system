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
import {
  deleteCustomer,
} from "../../service/LeadAndCustomersService";
import { Stack, TextField } from "@mui/material";
import axios from "axios";
import debounce from "lodash/debounce";


interface ValuesToTable {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: React.ReactElement;
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
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
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
      .get("http://localhost:3001/api/customers/by-page", {
        params: { page, limit: 50 },
      })
      .then((response) => {
        if (response.data.length < 50) {
          setHasMore(false);
          // אין יותר נתונים
        }
        setCustomers((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const uniqueNew = response.data.filter(
            (customer: Customer) => !ids.has(customer.id)
          );
          return [...prev, ...uniqueNew];
        });
        // עדכון המאגר הכללי של הלקוחות
        setAllCustomers((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const uniqueNew = response.data.filter(
            // מסנן לידים שלא קיימים כבר במאגר הכללי
            (customer: Customer) => !ids.has(customer.id)
          );
          return [...prev, ...uniqueNew];
        });
      })

      .catch((error) => {
        console.log("error in customerList page", error);

        console.error("Error fetching leads:", error);
      })
      .finally(() => setIsLoading(false));
      
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore || isSearching) return;

    // ברגע שהלידים עומדים להגמר זה עובר לעמוד הבא
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

    if (!term) {
      setIsSearching(false);
      setCustomers(allCustomers);
      setPage(1); // מחזיר לעמוד הראשון
      setHasMore(true); // מאפס את הסטטוס של יש עוד עמוד
      return;
    }

    setIsSearching(true);

    // סינון תומך באותיות קטנות וגדולות
    // מחפש גם לפי שם, פלאפון ודוא"ל
    // אם לא מצא תוצאות, שולח בקשה לשרת
    const filtered = allCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.phone.includes(term) ||
        customer.email.toLowerCase().includes(term.toLowerCase())
    );

    if (filtered.length > 0) {
      setCustomers(filtered);
    } else {
      axios
        .get("http://localhost:3001/api/customers/filter", {
          params: { q: term, page: 1, limit: 50 },
        })
        .then((response) => {
          setCustomers(response.data);
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
    return customers.map((customer) => ({
      id: customer.id!,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      status: (
        <div className="flex justify-between">
          {statusLabels[customer.status]}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`updateStatus/${customer.id}`)}
          >
            עדכון
          </Button>
        </div>
      ),
      businessName: customer.businessName,
      businessType: customer.businessType,
    }));
  };

  const columns: TableColumn<ValuesToTable>[] = [
    { header: "שם", accessor: "name" },
    { header: "פלאפון", accessor: "phone" },
    { header: "מייל", accessor: "email" },
    { header: "סטטוס", accessor: "status" },
    { header: "שם העסק", accessor: "businessName" },
    { header: "סוג עסק", accessor: "businessType" },
  ];
  <div ref={loaderRef} className="h-4"></div>


  const deleteCurrentCustomer = async (val: ValuesToTable) => {
    try {
      await deleteCustomer(val.id);

      alert("לקוח נמחק בהצלחה");
    } catch (error) {
      console.error("שגיאה במחיקת לקוח:", error);
      alert("מחיקה נכשלה");
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
            onDelete={deleteCurrentCustomer}
            onUpdate={editCustomer}
            renderActions={(row) => (
              <>
                <NavLink
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
                </NavLink>
              </>
            )}
          />
        </div>
      )}
    </>
  );
};
