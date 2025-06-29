import React, { useEffect, useState } from "react";
import { Button, ButtonProps } from '../../../../Common/Components/BaseComponents/Button';
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { Lead, LeadSource, LeadStatus, Person } from "shared-types";
import { SearchLeads } from "../SearchLeads";


//הערה חשובה!!
//בכל המקומות ששולחים שכתוב שצריך לעשות קריאת שרת כדי לקבל בודד מתוך הרשימה אפשר להעביר את כל האובייקט מהקומפוננטה של הרשימה ליחיד
//אבל זה אולי פחות בטיחותי

//הדף העיקרי של המתעניין וממנו בעצם יש לי קישורים לכל הקומפוננטות של המתעניין -בתחילה שיש לי מתענינים ולקוחות
//  רק את הדף הזה צריך לראות שלוחצים על מתענינים

interface ValuesToTable {
  id: string
  name: string; // שם המתעניין 
  status: LeadStatus; // סטטוס המתעניין 
  phone: string; // פלאפון
  email: string; // מייל
  linkToDetails: React.ReactElement; // קישור לפרטים של המתעניין
  deleteButton: React.ReactElement; // כפתור למחיקה
  renderActions?: (row: any) => React.ReactNode; // פונקציית
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
          linkToDetails: <NavLink to={`:${lead.id}`}>פרטי לקוח</NavLink>,
          deleteButton: (
              <Button variant="primary" size="sm" onClick={() => onDelete(lead.id!)}>X</Button>
          ),
      }));
  
      const Columns: TableColumn<ValuesToTable>[] = [
          { header: "שם", accessor: "name" },
          { header: "סטטוס", accessor: "status" },
          { header: "פלאפון", accessor: "phone" },
          { header: "מייל", accessor: "email" },
          { header: "פרטים", accessor: "linkToDetails" },
          { header: "מחיקה", accessor: "deleteButton" }
  
      ];

    

  const deleteLead = (val: ValuesToTable) => {
    //כאן יהיה קריאת שרת למחיקת לקוח ועדכון מחדש של המערך המקומי
    //זה רק דוג' למחיקה מקומית
    const newCustomers = leads.filter(lead => lead.id !== val.id);
    // setLeads(newCustomers); // עדכון ה-state
  }

  const updateLead = (val: ValuesToTable) => {

  }


  const goToAnotherPage = () => {
    // navigate("detailsOfTheLead");
    {/*זה הפונקצייה שמעבירה אותנו באת לחיצה על הכפתור לדף שנבחר*/ }
  }
  // const goTointerestedCustomerRegistration = () => {
  //   navigate("interestedCustomerRegistration");
  //   {/*זה הפונקצייה שמעבירה אותנו באת לחיצה על הכפתור לדף שנבחר*/ }
  // }


  return <div className="p-6">
    <h2 className="text-3xl font-bold text-center text-blue-600 my-4">מתעניינים</h2>

    {/*כאן צריך להיות */}
    {/*input*/}
    {/* של חיפוש והתשובה שתגיע תשלח לפונקצייה של חיפוש לפי סטטוס/שם/ת.ז   */}

    {/* <h3>List of Leads</h3> */}
    <Button variant="primary" size="sm" onClick={() => navigate('intersections')}>אינטראקציות של מתעניינים</Button><br/>


    {/*כאן יהיה את  טבלה של רשימת המתענינים 
   */}
    {/*נ.ב(רשימת המתעניינים תהיה לפי סדר כזה שמי שבסטטוס שלו יהיה לחזור אליו בימים הקרובים כדי
      לשאול אותו איפה הוא אוחז והאם הוא מעוניין יהיה בראש הרשימה וכל השאר
      לפי א' ב אבל למעלה יהיה לפי תאריך השיחה מי שדיברנו בתאריך מוקדם יותר הוא יהיה בראש הרשימה)*/ }
    <Button onClick={goToAnotherPage} variant="primary" size="sm" >הוספת מתענין חדש </Button>

    <Table<ValuesToTable> data={valuesToTable} columns={Columns} onDelete={deleteLead} onUpdate={updateLead}
      renderActions={(row) => (
          <NavLink
            state={{ data: leads.find(lead => lead.id == row.id) }}
            to={`interestedCustomerRegistration`}
            className="text-blue-500 hover:underline ml-2"
          >
            לטופס רישום ללקוח
          </NavLink>

      )}
    />
  </div>

}
export const LeadsPage = () => {

    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/leads')
            .then(response => {
                setLeads(response.data);
                console.log("leads fetched successfully:", response.data);
            })
            .catch(error => {
                console.error("Error fetching leads:", error);
            });
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
            <h1>מתעניינים</h1>
            <SearchLeads onResults={handleSearchResults} />
            <LeadHomePage leads={leads} onDelete={handleDeleteLeads} />
        </div>
    );
};

