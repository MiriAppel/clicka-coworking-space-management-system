import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
// import { Button } from '../../../../Common/Components/BaseComponents/Button';
// import { NavLink } from "react-router";
// import { ExportToExcel } from '../exportToExcel';
// import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
// import { Customer, CustomerStatus } from "shared-types";
// import { deleteCustomer, getAllCustomers } from "../../Service/LeadAndCustomersService";
// import { Stack, TextField } from '@mui/material';
// import { supabase } from "../../../../Services/supabaseClient";

// interface ValuesToTable {
//     id: string;
//     name: string;
//     phone: string;
//     email: string;
//     status: React.ReactElement;
//     businessName: string;
//     businessType: string;
// }
// const statusLabels: Record<CustomerStatus, string> = {
//     ACTIVE: 'פעיל',
//     NOTICE_GIVEN: 'הודעת עזיבה',
//     EXITED: 'עזב',
//     PENDING: 'בהמתנה',
// };
// export const CustomersList = () => {
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(true);
//     const [customers, setCustomers] = useState<Customer[]>([]);
//     const [searchTerm, setSearchTerm] = useState('');

//     const fetchCustomers = async () => {
//         try {
//             setIsLoading(true);
//             const data = await getAllCustomers();
//             setCustomers(data);
//         } catch (error) {
//             console.error('Error fetching customers:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCustomers();
//          //לבדוק למה לא עובד המשתני סביבה!!!
//         // האזנה לשינויים בטבלת customers
//         const channel = supabase
//             .channel('public:customer')
//             .on(
//                 'postgres_changes',
//                 { event: '*', schema: 'public', table: 'customers' },
//                 (payload) => {
//                     // כל שינוי (הוספה, עדכון, מחיקה) יגרום לרענון הרשימה
//                     fetchCustomers();
//                 }
//             )
//             .subscribe();

//         // ניקוי מאזין כשיוצאים מהקומפוננטה
//         return () => {
//             supabase.removeChannel(channel);
//         };
//     }, []);

//     const handleSearch = (term: string) => {
//         const lower = term.toLowerCase();
//         const filtered = customers.filter((c) =>
//             c.name.toLowerCase().includes(lower) ||
//             c.email.toLowerCase().includes(lower) ||
//             c.phone.toLowerCase().includes(lower) ||
//             statusLabels[c.status].toLowerCase().includes(lower)||
//             c.businessName.toLowerCase().includes(lower)||
//             c.businessType.toLowerCase().includes(lower)
//         );
//         return filtered;
//     };

//     const getValuseToTable = (): ValuesToTable[] => {
//         return handleSearch(searchTerm).map(customer => ({
//             id: customer.id!,
//             name: customer.name,
//             phone: customer.phone,
//             email: customer.email,
//             status: (
//                 <div className="flex justify-between">
//                     {statusLabels[customer.status]}
//                     <Button variant="secondary" size="sm" onClick={() => navigate(`updateStatus/${customer.id}`)}>עדכון</Button>
//                 </div>
//             ),
//             businessName: customer.businessName,
//             businessType: customer.businessType,
//         }));
//     };

//     const columns: TableColumn<ValuesToTable>[] = [
//         { header: "שם", accessor: "name" },
//         { header: "פלאפון", accessor: "phone" },
//         { header: "מייל", accessor: "email" },
//         { header: "סטטוס", accessor: "status" },
//         { header: "שם העסק", accessor: "businessName" },
//         { header: "סוג עסק", accessor: "businessType" }
//     ];

//     const deleteCurrentCustomer = async (val: ValuesToTable) => {
//         try {
//             await deleteCustomer(val.id);
//             fetchCustomers();
//             alert("לקוח נמחק בהצלחה");
//         } catch (error) {
//             console.error("שגיאה במחיקת לקוח:", error);
//             alert("מחיקה נכשלה");
//         }
//     };
//     const editCustomer = (val: ValuesToTable) => {
//         const selected = customers.find(c => c.id === val.id);
//         navigate("update", { state: { data: selected } });
//     };
//     return (
//         <>
//             {isLoading ? (
//                 <h2 className="text-3xl font-bold text-center text-blue-600 my-4">טוען...</h2>
//             ) : (
//                 <div className="p-6">
//                     <h2 className="text-3xl font-bold text-center text-blue-600 my-4">לקוחות</h2>
//                     <ExportToExcel data={customers} fileName="לקוחות" /><br /><br />
//                     <Stack spacing={2} direction="row">
//                         <TextField
//                             label="חיפוש"
//                             fullWidth
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </Stack>
//                     <br />
//                     <Table<ValuesToTable>
//                         data={getValuseToTable()}
//                         columns={columns}
//                         onDelete={deleteCurrentCustomer}
//                         onUpdate={editCustomer}
//                         renderActions={(row) => (
//                             <>
//                                 <NavLink to={`:${row.id}/dashboard`} className="text-blue-500 hover:underline ml-2">לוח בקרה</NavLink>
//                                 <NavLink to={`:${row.id}/contract`} className="text-blue-500 hover:underline ml-2">חוזה לקוח</NavLink>
//                             </>
//                         )}
//                     />
//                 </div>
//             )}
//         </>
//     );
// };
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { NavLink } from "react-router";
import { ExportToExcel } from "../exportToExcel";
import {
  Table,
  TableColumn,
} from "../../../../Common/Components/BaseComponents/Table";
import { Customer, CustomerStatus } from "shared-types";
import { deleteCustomer } from "../../../../Services/LeadAndCustomersService";
import { Stack, TextField } from "@mui/material";
import axios from "axios";
import debounce from "lodash/debounce";
import { Pencil, Trash } from "lucide-react";
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
  const fetchCustomers = async () => {
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
  }
  useEffect(() => {
    // axios
    //   .get("http://localhost:3001/api/customers/by-page", {
    //     params: { page, limit: 50 },
    //   })
    //   .then((response) => {
    //     if (response.data.length < 50) {
    //       setHasMore(false);
    //       // אין יותר נתונים
    //     }
    //     setCustomers((prev) => {
    //       const ids = new Set(prev.map((l) => l.id));
    //       const uniqueNew = response.data.filter(
    //         (customer: Customer) => !ids.has(customer.id)
    //       );
    //       return [...prev, ...uniqueNew];
    //     });
    //     // עדכון המאגר הכללי של הלקוחות
    //     setAllCustomers((prev) => {
    //       const ids = new Set(prev.map((l) => l.id));
    //       const uniqueNew = response.data.filter(
    //         // מסנן לידים שלא קיימים כבר במאגר הכללי
    //         (customer: Customer) => !ids.has(customer.id)
    //       );
    //       return [...prev, ...uniqueNew];
    //     });
    //   })

    //   .catch((error) => {
    //     console.log("error in customerList page", error);

    //     console.error("Error fetching leads:", error);
    //   })
    //   .finally(() => setIsLoading(false));
    fetchCustomers()

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term || term.trim() === "") {
      setIsSearching(false);
      setPage(1); // זה יגרום ל-useEffect לטעון את הדף הראשון
      setCustomers([]); // מרוקן את הקיימים כדי שיטען מחדש
      setHasMore(true);
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
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.businessName?.toLowerCase().includes(term.toLowerCase()) ||
        customer.businessType?.toLowerCase().includes(term.toLowerCase()) ||
        statusLabels[customer.status]?.includes(term) ||
        translateStatus(customer.status)?.includes(term) // תרגום הסטטוס לחיפוש 
        || customer.status.toLowerCase().includes(term.toLowerCase()) // הוספת חיפוש ישיר על הסטטוס
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
      businessName: customer.businessName || "לא זמין",
      businessType: customer.businessType || "לא זמין",
      status: customer.status
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
          />{" "}
          <div ref={loaderRef} className="h-4"></div>
        </div>
      )}
    </>
  );
};
