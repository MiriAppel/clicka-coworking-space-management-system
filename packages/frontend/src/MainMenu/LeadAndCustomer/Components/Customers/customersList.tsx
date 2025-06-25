import { useNavigate } from "react-router-dom";
import React from 'react';
import { NavLink, Outlet } from "react-router";
import { ExportToExcel } from '../exportToExcel';
import { useState } from "react";
import type{ Customer } from "shared-types";
import { CustomerStatus, PaymentMethodType } from "shared-types";
import { Button, ButtonProps } from "../../../../Common/Components/BaseComponents/Button";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";

interface ValuesToTable {
    name: string; // שם הלקוח
    status: CustomerStatus; // סטטוס הלקוח
    linkToDetails: React.ReactElement; // קישור לפרטים של הלקוח
    deleteButton: ButtonProps; // כפתור למחיקת הלקוח - או שהמחיקה תהיה מתוך פרטי הלקוח
}

//כל הצבעים של הכפתורים והכל בכל העמודים הם דוג' בלבד
export const CustomersList = () => {
    const navigate = useNavigate();
    //דוג' בלבד לרשימת לקוחות
    //צריך לעשות קריאת שרת לקבלת כל הלקוחות למשתנה הזה
    const [customers, setCustomers] = useState<Customer[]>([
        {
            id: '1',
            name: 'יוסי כהן',
            phone: '050-1234567',
            email: 'yossi@example.com',
            idNumber: '123456789',
            businessName: 'יוסי טכנולוגיות',
            businessType: 'טכנולוגיה',
            status: CustomerStatus.ACTIVE,
            workspaceCount: 5,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-10T00:00:00Z',
            paymentMethods: [
                {
                    id: 'pm1',
                    customerId: '1',
                    isActive: true,
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-10T00:00:00Z',
                    creditCardLast4: '1234',
                }
            ],
            periods: [
                {
                    id: 'period1',
                    customerId: '1',
                    entryDate: '2023-01-01',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-10T00:00:00Z',
                }
            ],
        },
        {
            id: '2',
            name: 'שרה לוי',
            phone: '052-7654321',
            email: 'sara@example.com',
            idNumber: '987654321',
            businessName: 'שרה פתרונות',
            businessType: 'שירותים',
            status: CustomerStatus.ACTIVE,
            workspaceCount: 3,
            createdAt: '2023-02-01T00:00:00Z',
            updatedAt: '2023-02-10T00:00:00Z',
            paymentMethods: [
                {
                    id: 'pm2',
                    customerId: '2',
                    isActive: true,
                    createdAt: '2023-02-01T00:00:00Z',
                    updatedAt: '2023-02-10T00:00:00Z'
                }
            ],
            periods: [
                {
                    id: 'period2',
                    customerId: '2',
                    entryDate: '2023-02-01',
                    createdAt: '2023-02-01T00:00:00Z',
                    updatedAt: '2023-02-10T00:00:00Z'
                }
            ],
        }
    ]);

    //יצירת מערך עם ערכים המתאימים לטבלה
    const valuesToTable: ValuesToTable[] = customers.map(customer => ({
        name: customer.name,
        status: customer.status,
        //להוסיף כאן אפשרות לעדכון סטטוס שיפתח אפשרות לבחירה מתוך רשימה והפעלת פונצקיה לעדכון
        linkToDetails: <NavLink to={`:${customer.id}`}>פרטי לקוח</NavLink>, // קישור
        deleteButton: (
            <Button variant="primary" size="sm" onClick={() => deleteCustomer(customer.id!)}>X</Button>
        ),
    }));

    const Columns: TableColumn<ValuesToTable>[] = [
        { header: "שם", accessor: "name" },
        { header: "סטטוס", accessor: "status" },
        { header: "פרטים", accessor: "linkToDetails" },
        { header: "מחיקה", accessor: "deleteButton" }
    ];

    const deleteCustomer = (id: string) => {
        //כאן יהיה קריאת שרת למחיקת לקוח ועדכון מחדש של המערך המקומי
        //זה רק דוג' למחיקה מקומית
        const newCustomers = customers.filter(customer => customer.id !== id);
        setCustomers(newCustomers); // עדכון ה-state

    }

    const searchCustomer = () => {

        //חיפוש לקוח לפי הערך שהוזן באינפוט
        //שימוש בפונצקית חיפוש המוכנה
        //אפשר לעשות יותר מתקדם עם בחירה וכו לפי הדרישה
    }

    return (
        <div style={{ direction: "rtl", padding: "20px" }}>
            <h1 >לקוחות</h1>

            {/* שימוש בקומפוננטה של יצוא לאקסל */}
            <ExportToExcel data={customers} fileName="לקוחות" /><br />
            <Button variant="primary" size="sm" onClick={() => navigate('intersections')}>אינטראקציות של לקוחות</Button><br />

            {/* אפשרות חיפוש - בחירה לפי מה לחפש ושדה להכנסת ערך לחיפוש - אפשר בקומפוננטה נפרדת */}
            <input type="text" placeholder="הכנס ערך לחיפוש" />
            {/* לא חייבים את הכפתור אפשר בכל לחיצת מקלדת של קלט לחפש */}
            <Button variant="primary" size="sm" onClick={() => searchCustomer()}>חיפוש</Button>

            {/* טבלה של כל הלקוחות עם שם וסטטוס ולכל אחד קישור לקומפוננטה של לקוח בודד שתציג את כל הפרטים המלאים שלו */}
            <Table<ValuesToTable> data={valuesToTable} columns={Columns} dir="rtl" />
            {/* {customers.map(customer =>
                <p>שם: <NavLink to={customer.id} > {customer.name} </NavLink> | סטטוס: {customer.status} <Button variant="primary" size="sm" onClick={() => deleteCustomer(customer.id)}>Delete</Button></p>)} */}

        </div>
    );
}

