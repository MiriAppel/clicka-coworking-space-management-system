import React, { useState } from "react";
import { Button, ButtonProps } from '../../../Common/Components/BaseComponents/Button';
import { Table, TableColumn } from "../../../Common/Components/BaseComponents/Table";

import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { Lead, LeadSource, LeadStatus } from "shared-types";


//הדף העיקרי של המתעניין וממנו בעצם יש לי קישורים לכל הקומפוננטות של המתעניין -בתחילה שיש לי מתענינים ולקוחות
//  רק את הדף הזה צריך לראות שלוחצים על מתענינים

interface ValuesToTable {
  name: string; // שם המתעניין 
  status: LeadStatus; // סטטוס המתעניין 
  linkToDetails: React.ReactElement; // קישור לפרטים של המתעניין
  deleteButton: ButtonProps; // כפתור למחיקת המתעניין
}
//צריך לעשות קריאת שרת לקבלת כל המתעניינים למשתנה הזה


export const LeadHomePage = () => {
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead[]>([
  {idNumber:'1',
    name:"אברהם ישראלי",
    phone: "050-1234567",
    email: "a567@gmail.com",
    status: LeadStatus.LOST,
    businessType:'עסק קטן',
    createdAt:"2022-12-01T00:00:00Z",
    interactions:[],
    interestedIn:[],
    source:LeadSource.EVENT,
    updatedAt: "2023-01-10T00:00:00Z"
    }]);
  //יצירת מערך עם ערכים המתאימים לטבלה
  const valuesToTable: ValuesToTable[] = lead.map(lead => ({
    name: lead.name,
    status: lead.status,
    linkToDetails: <NavLink to={`:${lead.id}`}>פרטי מתעניין</NavLink>, // קישור
    deleteButton: (
      <Button variant="primary" size="sm" onClick={() => deleteLead(lead.idNumber)}>X</Button>
    ),
  }));

  // 3. מגדיר את הCOLUMN
  const columns: TableColumn<ValuesToTable>[] = [
    { header: "שם", accessor: "name" },
    { header: "סטטוס", accessor: "status" },
    { header: "פרטים", accessor: "linkToDetails" },
    { header: "מחיקה", accessor: "deleteButton" },
  ];

  const deleteLead = (id: string) => {
    //כאן יהיה קריאת שרת למחיקת לקוח ועדכון מחדש של המערך המקומי
    //זה רק דוג' למחיקה מקומית
    const newCustomers = lead.filter(lead => lead.id !== id);
    setLead(newCustomers); // עדכון ה-state
  }
  const goToAnotherPage = () => {
    navigate("detailsOfTheLead");
    {/*זה הפונקצייה שמעבירה אותנו באת לחיצה על הכפתור לדף שנבחר*/ }
  }
  const goTointerestedCustomerRegistration = () => {
    navigate("interestedCustomerRegistration");
    {/*זה הפונקצייה שמעבירה אותנו באת לחיצה על הכפתור לדף שנבחר*/ }
  }


  return <div className='leadHomePage'>

    <h1>leadHomePage</h1>

    {/*כאן צריך להיות */}
    {/*input*/}
    {/* של חיפוש והתשובה שתגיע תשלח לפונקצייה של חיפוש לפי סטטוס/שם/ת.ז   */}

    <h3>List of Leads</h3>
    <Button variant="primary" size="sm" onClick={() => navigate('intersections')}>אינטראקציות של מתעניינים</Button>


    {/*כאן יהיה את  טבלה של רשימת המתענינים 
   */}
    {/*נ.ב(רשימת המתעניינים תהיה לפי סדר כזה שמי שבסטטוס שלו יהיה לחזור אליו בימים הקרובים כדי
      לשאול אותו איפה הוא אוחז והאם הוא מעוניין יהיה בראש הרשימה וכל השאר
      לפי א' ב אבל למעלה יהיה לפי תאריך השיחה מי שדיברנו בתאריך מוקדם יותר הוא יהיה בראש הרשימה)*/ }
    <Button onClick={goToAnotherPage} variant="primary" size="sm" >הוספת מתענין חדש/עדכון פרטי מתעניין </Button>
    {/*ברגע שלוחצים על הכפתור הוא מעביר אותנו לעמוד הוספת פרטים למתענין*/}
    {/* הקישור הוא לדף פרטי המתעניין אם חסר פרטים הוא יציג רק את הפרטים שחסרים אם חסר את כל הפרטים
   הוא יבקש ממנו את כל הפרטים זה פונקציות שצריכות להעשות לא עשיתי אותם*/ }
    <Button onClick={goTointerestedCustomerRegistration} variant="primary" size="sm" >רישום מתעניין ללקוח</Button>
    {/* זה כפתור שמעביר אותי לדף רישום מתעניין ללקוח אני לא רוצה לאבד את הנתוני שכבר יש לי ולכן צריך לעשות משהו 
כדי לשמור על הנתונים*/ }
    {/*(המטרה העיקרית בדף הזה הוא להשתמש בכמה שיותר דברים שאני כבר יודעת ולא צריך להתחיל לתשאל על כל הפרטים שאני יודעת כבר!!
צריך לעשות פונקצייה שתבדוק אילו פרטים שאני צריכה ללקוח חסר לי עליו ובנוסף אני 
רוצה לשמור את מי הביא את המתעניין והאינטרקציות הקודמות שלנו איתו כדי שנחמה תדע 
מה הולך איתו מתחילה-ברגע שלוחצת על הכפתור הזה היא עוברת לדף של כל מה שצריך בלקוח
 מלא במה שיש לו כבר מהנתונים שיש לנו ומה שחסר ועדיין צריך למלא וכמובן מילוי חוזה.
*/ }
    <Table<ValuesToTable> data={valuesToTable} columns={columns} dir="rtl" />
  </div>
}