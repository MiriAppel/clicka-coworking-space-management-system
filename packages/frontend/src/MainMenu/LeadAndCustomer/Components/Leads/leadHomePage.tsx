// import React, { useEffect, useState } from "react";
// import { Button, ButtonProps } from '../../../../Common/Components/BaseComponents/Button';
// import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
// import axios from "axios";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Link, NavLink } from "react-router-dom";
// import { Lead, LeadSource, LeadStatus, Person } from "shared-types";
// import { SearchLeads } from "./searchLead";
// import { deleteLead } from "../../Service/LeadAndCustomersService";

// interface ValuesToTable {
//   id: string
//   name: string; // שם המתעניין
//   status: LeadStatus; // סטטוס המתעניין
//   phone: string; // פלאפון
//   email: string; // מייל
// }
// //צריך לעשות קריאת שרת לקבלת כל המתעניינים למשתנה הזה

import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import {
  Table,
  TableColumn,
} from "../../../../Common/Components/BaseComponents/Table";
import { Lead } from "shared-types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SearchLeads } from "./SearchLeads";
import { deleteLead } from "../../Service/LeadAndCustomersService";


interface ValuesToTable {
  id: string;
  name: string;
  status: string;
  phone: string;
  email: string;
}

interface LeadsListProps {
  leads: Lead[];
  onDelete: (id: string) => void;
}
// export const LeadHomePage = ({ leads, onDelete }: LeadsListProps) => {
//   console.log(leads + "leads in start");
//   const navigate = useNavigate();
//   const valuesToTable: ValuesToTable[] = leads.map(lead => ({

export const LeadHomePage = ({ leads, onDelete }: LeadsListProps) => {

  const navigate = useNavigate();

  const valuesToTable: ValuesToTable[] = leads.map((lead) => ({
    id: lead.id!,
    name: lead.name,
    status: lead.status,
    phone: lead.phone,
    email: lead.email,
  }));
  const Columns: TableColumn<ValuesToTable>[] = [
    { header: "שם", accessor: "name" },
    { header: "סטטוס", accessor: "status" },
    { header: "פלאפון", accessor: "phone" },
    { header: "מייל", accessor: "email" },
  ];


  //   const updateLead = (val: ValuesToTable) => {
  //   }

  //   // const goTointerestedCustomerRegistration = () => {
  //   //   navigate("interestedCustomerRegistration");
  //   //   {/*זה הפונקצייה שמעבירה אותנו באת לחיצה על הכפתור לדף שנבחר*/ }
  //   // }
  //   return <div className="p-6">

  //     <Table<ValuesToTable> data={valuesToTable} columns={Columns} onDelete={deleteCurrentLead} onUpdate={updateLead}
  //       renderActions={(row) => (
  //         <Button
  //           onClick={() => navigate("interestedCustomerRegistration", { state: { data: leads.find(lead => lead.id == row.id) } })}
  //           variant="primary"
  //           size="sm"
  //         >
  //           לטופס רישום ללקוח
  //         </Button>

  //       )}
  //     />
  //   </div>
  // }
  // export const LeadsPage = () => {
  //   const navigate = useNavigate();
  //   const [leads, setLeads] = useState<Lead[]>([]);
  //   const goToAnotherPage = () => {
  //     // navigate("detailsOfTheLead");
  //     {/*זה הפונקצייה שמעבירה אותנו באת לחיצה על הכפתור לדף שנבחר*/ }
  //   }
  //   useEffect(() => {
  //     axios.get('http://localhost:3001/api/leads')
  //       .then(response => {
  //         setLeads(response.data);
  //         console.log("leads fetched successfully:", response.data);
  //       })
  //       .catch(error => {
  //         console.error("Error fetching leads:", error);
  //       });
  //       console.log(leads);

  //     // const initialCustomers: Customer[] = [ /* ...רשימת לקוחות ראשונית */];
  //     // setCustomers(initialCustomers);
  //   }, []);
  //   const handleDeleteLeads = (id: string) => {
  //     setLeads(prev => prev.filter(l => l.id !== id));
  //   };
  //   const handleSearchResults = (results: Person[]) => {
  //     const onlyCustomers = results.filter((p): p is Lead =>
  //       'status' in p && 'name' in p
  //     );
  //     setLeads(onlyCustomers);
  //   };
  //   return (
  //     <div style={{ direction: "rtl", padding: "20px" }}>
  //       <h2 className="text-3xl font-bold text-center text-blue-600 my-4">מתעניינים</h2>
  //       <Button variant="primary" size="sm" onClick={() => navigate('intersections')}>אינטראקציות של מתעניינים</Button><br />
  //       <Button onClick={goToAnotherPage} variant="primary" size="sm" >הוספת מתענין חדש </Button>
  //       <SearchLeads onResults={handleSearchResults} />
  //       <LeadHomePage leads={leads} onDelete={handleDeleteLeads} />
  //     </div>
  //   );
  // };
  //עד פה

  return (
    <div className="p-6">

      <Table<ValuesToTable>
        data={valuesToTable}
        columns={Columns}
        onDelete={(val) => onDelete(val.id)}
        renderActions={(row) => (
          <Button
            onClick={() => navigate("interestedCustomerRegistration", { state: { data: leads.find(lead => lead.id == row.id) } })}
            variant="primary"
            size="sm"
          >
            לטופס רישום ללקוח
          </Button>
        )}
      />
    </div>
  );
};

export const LeadsPage = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // שליפה ראשונית מהשרת

  const fetchLeads = async () => {
        console.log("Fetching initial leads...");

    axios
      .get("http://localhost:3001/api/leads/by-page", {
        params: { page, limit: 50 },
      })
      .then((response) => {
        if (response.data.length < 50) {
          setHasMore(false); // אין יותר נתונים
        }
        // עדכון הלידים שצריכים להופיע בדף
        setLeads((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const uniqueNew = response.data.filter(
            (lead: Lead) => !ids.has(lead.id)
          );
          return [...prev, ...uniqueNew];
        });

        // עדכון המאגר הכללי של הלידים
        setAllLeads((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const uniqueNew = response.data.filter(
            // מסנן לידים שלא קיימים כבר במאגר הכללי
            (lead: Lead) => !ids.has(lead.id)
          );
          return [...prev, ...uniqueNew];
        });
      })
      .catch((error) => {
        console.log("error in leadHomePage.tsx useEffect:", error);

        console.error("Error fetching leads:", error);
      });
  }
  useEffect(() => {
    fetchLeads();
    // console.log("Fetching initial leads...");

    // axios
    //   .get("http://localhost:3001/api/leads/by-page", {
    //     params: { page, limit: 50 },
    //   })
    //   .then((response) => {
    //     if (response.data.length < 50) {
    //       setHasMore(false); // אין יותר נתונים
    //     }
    //     // עדכון הלידים שצריכים להופיע בדף
    //     setLeads((prev) => {
    //       const ids = new Set(prev.map((l) => l.id));
    //       const uniqueNew = response.data.filter(
    //         (lead: Lead) => !ids.has(lead.id)
    //       );
    //       return [...prev, ...uniqueNew];
    //     });

    //     // עדכון המאגר הכללי של הלידים
    //     setAllLeads((prev) => {
    //       const ids = new Set(prev.map((l) => l.id));
    //       const uniqueNew = response.data.filter(
    //         // מסנן לידים שלא קיימים כבר במאגר הכללי
    //         (lead: Lead) => !ids.has(lead.id)
    //       );
    //       return [...prev, ...uniqueNew];
    //     });
    //   })
    //   .catch((error) => {
    //     console.log("error in leadHomePage.tsx useEffect:", error);

    //     console.error("Error fetching leads:", error);
    //   });
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
      setLeads(allLeads);
      setPage(1); // מחזיר לעמוד הראשון
      setHasMore(true); // מאפס את הסטטוס של יש עוד עמוד
      return;
    }

    setIsSearching(true);

    // סינון תומך באותיות קטנות וגדולות
    // מחפש גם לפי שם, פלאפון ודוא"ל
    // אם לא מצא תוצאות, שולח בקשה לשרת
    const filtered = allLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(term.toLowerCase()) ||
        lead.phone.includes(term) ||
        lead.email.toLowerCase().includes(term.toLowerCase())
    );

    if (filtered.length > 0) {
      setLeads(filtered);
    } else {
      axios
        .get("http://localhost:3001/api/leads/filter", {
          params: { q: term, page: 1, limit: 50 },
        })
        .then((response) => {
          setLeads(response.data);
        })
        .catch((error) => {
          console.error("Error searching from server:", error);
        });
    }
  };

  // const handleDeleteLeads = (id: string) => {
  //   setLeads((prev) => prev.filter((l) => l.id !== id));
  //   setAllLeads((prev) => prev.filter((l) => l.id !== id)); // גם מהמאגר הכללי
  // };
  const navigate = useNavigate();

  const deleteCurrentLead = async (id: string) => {
    try {
      await deleteLead(id);
      //לראות איך לעדכן את הנתונים או שיעבוד הרפרוש או לרפרש שוב
      fetchLeads();
      alert("מתעניין נמחק בהצלחה");
    } catch (error) {
      console.error("שגיאה במחיקת מתעניין:", error);
      alert("מחיקה נכשלה");
    }
  };


  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      <h2 className="text-3xl font-bold text-center text-blue-600 my-4">מתעניינים</h2>
      <Button
        variant="primary"
        size="sm"
        onClick={() => navigate("intersections")}
      >
        אינטראקציות של מתעניינים
      </Button>
      <Button
        onClick={() => navigate("interestedCustomerRegistration")}
        variant="primary"
        size="sm"
      >
        הוספת מתעניין חדש
      </Button>
      <br />
      <br />
      <SearchLeads
        term={searchTerm}
        setTerm={setSearchTerm}
        onSearch={handleSearch}
      />
      <LeadHomePage leads={leads} onDelete={deleteCurrentLead} />
      <div ref={loaderRef} style={{ height: "1px" }} />
    </div>
  );
};
