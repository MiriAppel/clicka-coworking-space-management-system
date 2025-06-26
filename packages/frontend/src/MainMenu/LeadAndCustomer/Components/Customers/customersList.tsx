import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import React from 'react';
import { Button, ButtonProps } from '../../../../Common/Components/BaseComponents/Button';
import { NavLink, Outlet } from "react-router";
import { ExportToExcel } from '../exportToExcel';
import { useState } from "react";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { Customer, CustomerStatus, PaymentMethodType } from "shared-types";

interface ValuesToTable {
    id: string;
    name: string; // שם הלקוח
    status: CustomerStatus; // סטטוס הלקוח
=======
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ExportToExcel } from '../exportToExcel';
import type { Customer, ID, Person } from "shared-types";
import { CustomerStatus, PaymentMethodType } from "shared-types";
import { Button, ButtonProps } from "../../../../Common/Components/BaseComponents/Button";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { SearchCustomer } from "../SearchCustumer";

interface ValuesToTable {
    id: ID;
    name: string; // שם הלקוח
    status: CustomerStatus; // סטטוס הלקוח
    phone: string; // פלאפון
    email: string;
    linkToDetails: React.ReactElement; // קישור לפרטים של הלקוח
    deleteButton: React.ReactElement; // כפתור למחיקה
    renderActions?: (row: any) => React.ReactNode;
>>>>>>> a84e40f069b9706528654916bbe8cfad3d7258f6
}

interface CustomersListProps {
    customers: Customer[];
    onDelete: (id: string) => void;
}

export const CustomersList = ({ customers, onDelete }: CustomersListProps) => {
    const navigate = useNavigate();

    const valuesToTable: ValuesToTable[] = customers.map(customer => ({
        id: customer.id,
        name: customer.name,
        status: customer.status,
<<<<<<< HEAD

=======
        phone: customer.phone,
        email: customer.email,
        linkToDetails: <NavLink to={`:${customer.id}`}>פרטי לקוח</NavLink>,
        deleteButton: (
            <Button variant="primary" size="sm" onClick={() => onDelete(customer.id!)}>X</Button>
        ),
>>>>>>> a84e40f069b9706528654916bbe8cfad3d7258f6
    }));

    const Columns: TableColumn<ValuesToTable>[] = [
        { header: "שם", accessor: "name" },
        { header: "סטטוס", accessor: "status" },
<<<<<<< HEAD
    ];

    const deleteCustomer = (val: ValuesToTable) => {
        //כאן יהיה קריאת שרת למחיקת לקוח ועדכון מחדש של המערך המקומי
        //זה רק דוג' למחיקה מקומית
        const newCustomers = customers.filter(customer => customer.id !== val.id);
        setCustomers(newCustomers); // עדכון ה-state

    }

    const editCustomer = (val: ValuesToTable) => {
        //כאן יפתח טופס למילוי הפרטים האפשריים לעריכה
        //מאותחל בכל הפרטים הנוכחחים עם אפשרות לשנות
        //צריך להפעיל קריאת שרת של עריכת לקוח ולעדכן בהתאם את הנתונים
    }

    const searchCustomer = () => {

        //חיפוש לקוח לפי הערך שהוזן באינפוט
        //שימוש בפונצקית חיפוש המוכנה
        //אפשר לעשות יותר מתקדם עם בחירה וכו לפי הדרישה
    }

    return (
        <div className="p-6">
=======
        { header: "פלאפון", accessor: "phone" },
        { header: "מייל", accessor: "email" },
        { header: "פרטים", accessor: "linkToDetails" },
        { header: "מחיקה", accessor: "deleteButton" }

    ];

    return (
        <>
          <div className="p-6">
>>>>>>> a84e40f069b9706528654916bbe8cfad3d7258f6
            <h2 className="text-3xl font-bold text-center text-blue-600 my-4">לקוחות</h2>

            {/* שימוש בקומפוננטה של יצוא לאקסל */}
            <ExportToExcel data={customers} fileName="לקוחות" /><br />
            <Button variant="primary" size="sm" onClick={() => navigate('intersections')}>אינטראקציות של לקוחות</Button><br />

<<<<<<< HEAD
            {/* אפשרות חיפוש - בחירה לפי מה לחפש ושדה להכנסת ערך לחיפוש - אפשר בקומפוננטה נפרדת */}
            <input type="text" placeholder="הכנס ערך לחיפוש" />
            {/* לא חייבים את הכפתור אפשר בכל לחיצת מקלדת של קלט לחפש */}
            <Button variant="secondary" size="sm" onClick={() => searchCustomer()}>חיפוש</Button>

            {/* טבלה של כל הלקוחות עם שם וסטטוס ולכל אחד קישור לקומפוננטה של לקוח בודד שתציג את כל הפרטים המלאים שלו */}
            <Table<ValuesToTable> data={valuesToTable} columns={Columns} dir="rtl" onDelete={deleteCustomer} onUpdate={editCustomer}
                renderActions={(row) => (
                    <>
                        {/* לא בטוח שצריך את הדברים האלה!!!! */}
=======
            
            {/* טבלה של כל הלקוחות עם שם וסטטוס ולכל אחד קישור לקומפוננטה של לקוח בודד שתציג את כל הפרטים המלאים שלו */}
            <Table<ValuesToTable> data={valuesToTable} columns={Columns} dir="rtl" 
                renderActions={(row) => (
                    <>
>>>>>>> a84e40f069b9706528654916bbe8cfad3d7258f6
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
        </>
    );
};
export const CustomersPage = () => {

    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        // טעינת הלקוחות — יכול להיות קריאה ל-API או סטטי:
        const initialCustomers: Customer[] = [ /* ...רשימת לקוחות ראשונית */];
        setCustomers(initialCustomers);
    }, []);

    const handleDeleteCustomer = (id: string) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    const handleSearchResults = (results: Person[]) => {

        const onlyCustomers = results.filter((p): p is Customer =>
            'status' in p && 'contractSignDate' in p
        );
        setCustomers(onlyCustomers);
    };

    return (
        

        <div style={{ direction: "rtl", padding: "20px" }}>
            <h1>לקוחות</h1>
            <SearchCustomer onResults={handleSearchResults} />
            <CustomersList customers={customers} onDelete={handleDeleteCustomer} />
        </div>
    );
};

