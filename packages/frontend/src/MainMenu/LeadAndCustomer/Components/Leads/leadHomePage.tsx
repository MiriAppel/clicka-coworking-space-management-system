import React, { useEffect, useState } from "react";
import { Button, ButtonProps } from '../../../../Common/Components/BaseComponents/Button';
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { Lead, LeadSource, LeadStatus, Person } from "shared-types";
import { SearchLeads } from "./searchLead";
import { deleteLead } from "../../Service/LeadAndCustomersService";

interface ValuesToTable {
  id: string
  name: string; // שם המתעניין
  status: LeadStatus; // סטטוס המתעניין
  phone: string; // פלאפון
  email: string; // מייל
}
//צריך לעשות קריאת שרת לקבלת כל המתעניינים למשתנה הזה
interface LeadsListProps {
  leads: Lead[];
  onDelete: (id: string) => void;
}
export const LeadHomePage = ({ leads, onDelete }: LeadsListProps) => {
  console.log(leads + "leads in start");
  const navigate = useNavigate();
  const valuesToTable: ValuesToTable[] = leads.map(lead => ({
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
  const deleteCurrentLead = async (val: ValuesToTable) => {
          try {
              await deleteLead(val.id);
              // fetchCustomers();
              alert("מתעניין נמחק בהצלחה");
          } catch (error) {
              console.error("שגיאה במחיקת מתעניין:", error);
              alert("מחיקה נכשלה");
          }
      };
  const updateLead = (val: ValuesToTable) => {
  }

  // const goTointerestedCustomerRegistration = () => {
  //   navigate("interestedCustomerRegistration");
  //   {/*זה הפונקצייה שמעבירה אותנו באת לחיצה על הכפתור לדף שנבחר*/ }
  // }
  return <div className="p-6">

    <Table<ValuesToTable> data={valuesToTable} columns={Columns} onDelete={deleteCurrentLead} onUpdate={updateLead}
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
}
export const LeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const goToAnotherPage = () => {
    // navigate("detailsOfTheLead");
    {/*זה הפונקצייה שמעבירה אותנו באת לחיצה על הכפתור לדף שנבחר*/ }
  }
  useEffect(() => {
    axios.get('http://localhost:3001/api/leads')
      .then(response => {
        setLeads(response.data);
        console.log("leads fetched successfully:", response.data);
      })
      .catch(error => {
        console.error("Error fetching leads:", error);
      });
      console.log(leads);
      
    // const initialCustomers: Customer[] = [ /* ...רשימת לקוחות ראשונית */];
    // setCustomers(initialCustomers);
  }, []);
  const handleDeleteLeads = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };
  const handleSearchResults = (results: Person[]) => {
    const onlyCustomers = results.filter((p): p is Lead =>
      'status' in p && 'name' in p
    );
    setLeads(onlyCustomers);
  };
  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      <h2 className="text-3xl font-bold text-center text-blue-600 my-4">מתעניינים</h2>
      <Button variant="primary" size="sm" onClick={() => navigate('intersections')}>אינטראקציות של מתעניינים</Button><br />
      <Button onClick={goToAnotherPage} variant="primary" size="sm" >הוספת מתענין חדש </Button>
      <SearchLeads onResults={handleSearchResults} />
      <LeadHomePage leads={leads} onDelete={handleDeleteLeads} />
    </div>
  );
};

// import { NavLink, useNavigate } from "react-router-dom";
// import { Button } from "../../../../Common/Components/BaseComponents/Button";
// import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
// import { Lead } from "shared-types";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { SearchLeads } from "./searchLead";
// interface ValuesToTable {
//   id: string;
//   name: string;
//   status: string;
//   phone: string;
//   email: string;
//   linkToDetails: React.ReactElement;
//   deleteButton: React.ReactElement;
// }
// interface LeadsListProps {
//   leads: Lead[];
//   onDelete: (id: string) => void;
// }
// export const LeadHomePage = ({ leads, onDelete }: LeadsListProps) => {
//   const navigate = useNavigate();
//   const valuesToTable: ValuesToTable[] = leads.map((lead) => ({
//     id: lead.id!,
//     name: lead.name,
//     status: lead.status,
//     phone: lead.phone,
//     email: lead.email,
//     linkToDetails: <NavLink to={`:${lead.id}`}>פרטי לקוח</NavLink>,
//     deleteButton: (
//       <Button variant="primary" size="sm" onClick={() => onDelete(lead.id!)}>
//         X
//       </Button>
//     ),
//   }));
//   const columns: TableColumn<ValuesToTable>[] = [
//     { header: "שם", accessor: "name" },
//     { header: "סטטוס", accessor: "status" },
//     { header: "פלאפון", accessor: "phone" },
//     { header: "מייל", accessor: "email" },
//   ];
//   return (
//     <div className="p-6">
//       <Button
//         variant="primary"
//         size="sm"
//         onClick={() => navigate("intersections")}
//       >
//         אינטראקציות של מתעניינים
//       </Button>
//       <Button
//         onClick={() => navigate("interestedCustomerRegistration")}
//         variant="primary"
//         size="sm"
//       >
//         הוספת מתעניין חדש
//       </Button>
//       <Table<ValuesToTable>
//         data={valuesToTable}
//         columns={columns}
//         onDelete={(val) => onDelete(val.id)}
//         renderActions={(row) => (
//           <NavLink
//             state={{ data: leads.find((lead) => lead.id == row.id) }}
//             to={`interestedCustomerRegistration`}
//             className="text-blue-500 hover:underline ml-2"
//           >
//             לטופס רישום ללקוח
//           </NavLink>
//         )}
//       />
//     </div>
//   );
// };
// export const LeadsPage = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [allLeads, setAllLeads] = useState<Lead[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   // שליפה ראשונית מהשרת
//   useEffect(() => {
//     axios
//       .get("http://localhost:3001/api/leads/filter", {
//         params: { q: "", page: 1, limit: 1000 },
//       })
//       .then((response) => {
//         setLeads(response.data);
//         setAllLeads(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching leads:", error);
//       });
//   }, []);
//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     // חיפוש בצד לקוח
//     const filtered = allLeads.filter((lead) =>
//       lead.name.includes(term) ||
//       lead.phone.includes(term) ||
//       lead.email.includes(term)
//     );
//     if (filtered.length > 0) {
//       setLeads(filtered);
//     } else {
//       // חיפוש בצד שרת אם לא נמצא כלום
//       axios
//         .get("http://localhost:3001/api/leads/filter", {
//           params: { q: term, page: 1, limit: 50 },
//         })
//         .then((response) => {
//           setLeads(response.data);
//         })
//         .catch((error) => {
//           console.error("Error searching from server:", error);
//         });
//     }
//   };
//   const handleDeleteLeads = (id: string) => {
//     setLeads((prev) => prev.filter((l) => l.id !== id));
//     setAllLeads((prev) => prev.filter((l) => l.id !== id)); // גם מהמאגר הכללי
//   };
//   return (
//     <div style={{ direction: "rtl", padding: "20px" }}>
//       <h1>מתעניינים</h1>
//       <SearchLeads onSearch={handleSearch} />
//       <LeadHomePage leads={leads} onDelete={handleDeleteLeads} />
//     </div>
//   );
// };