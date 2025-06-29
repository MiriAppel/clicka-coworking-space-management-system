import React, { useState } from "react";
import { Button, ButtonProps } from '../../../../Common/Components/BaseComponents/Button';
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";

import { Outlet, useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";


//הערה חשובה!!
//בכל המקומות ששולחים שכתוב שצריך לעשות קריאת שרת כדי לקבל בודד מתוך הרשימה אפשר להעביר את כל האובייקט מהקומפוננטה של הרשימה ליחיד
//אבל זה אולי פחות בטיחותי

//הדף העיקרי של המתעניין וממנו בעצם יש לי קישורים לכל הקומפוננטות של המתעניין -בתחילה שיש לי מתענינים ולקוחות
//  רק את הדף הזה צריך לראות שלוחצים על מתענינים

interface ValuesToTable {
  id: string
  name: string; // שם המתעניין 
  status: LeadStatus; // סטטוס המתעניין 
}
//צריך לעשות קריאת שרת לקבלת כל המתעניינים למשתנה הזה


export const LeadHomePage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "אברהם ישראלי",
      phone: "0501234567",
      email: "a567@gmail.com",
      idNumber: "123456789",
      status: LeadStatus.LOST,
      updatedAt: "2023-01-10T00:00:00Z",
      businessType: "עסק קטן",         // לדוגמה
      interestedIn: [],
      source: LeadSource.EVENT,
      interactions: [],
      createdAt: "2022-12-01T00:00:00Z"
    },
    {
      id: "2",
      name: "מיכל כהן",
      phone: "0527654321",
      email: "michal@example.com",
      status: LeadStatus.INTERESTED,
      updatedAt: "2023-02-15T00:00:00Z",
      businessType: "עסק בינוני",
      interestedIn: [],
      source: LeadSource.WEBSITE,
      interactions: [],
      createdAt: "2022-11-10T00:00:00Z"
    }
  ]);
  //יצירת מערך עם ערכים המתאימים לטבלה
  const valuesToTable: ValuesToTable[] = leads.map(lead => ({
    id: lead.id,
    name: lead.name,
    status: lead.status,

  }));

  // 3. מגדיר את הCOLUMN
  const columns: TableColumn<ValuesToTable>[] = [
    { header: "שם", accessor: "name" },
    { header: "סטטוס", accessor: "status" },
  ];

  const deleteLead = (val: ValuesToTable) => {
    //כאן יהיה קריאת שרת למחיקת לקוח ועדכון מחדש של המערך המקומי
    //זה רק דוג' למחיקה מקומית
    const newCustomers = leads.filter(lead => lead.id !== val.id);
    setLeads(newCustomers); // עדכון ה-state
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

    <Table<ValuesToTable> data={valuesToTable} columns={columns} onDelete={deleteLead} onUpdate={updateLead}
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