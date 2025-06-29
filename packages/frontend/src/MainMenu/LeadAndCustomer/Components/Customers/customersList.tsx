import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, ButtonProps } from '../../../../Common/Components/BaseComponents/Button';
import { NavLink, Outlet } from "react-router";
import { ExportToExcel } from '../exportToExcel';
import { useState, useEffect } from "react";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { Customer, CustomerStatus, PaymentMethodType, WorkspaceType } from "shared-types";
import { getAllCustomers, deleteCustomer } from '../../Service/LeadAndCustomersService';
import { supabase } from '../../../../Services/supabaseClient';

interface ValuesToTable {
    id: string;
    name: string; // שם הלקוח
    phone: string; // פלאפון
    email: string;
    status: React.ReactElement; // סטטוס הלקוח
    //להוסיף שם עסק, סוג עסק וכו לפי מה שרוצים
}

//בשביל שבתצוגה זה יהיה בעברית
const statusLabels: Record<CustomerStatus, string> = {
    ACTIVE: 'פעיל',
    NOTICE_GIVEN: 'הודעת עזיבה',
    EXITED: 'עזב',
    PENDING: 'בהמתנה',
};

//כל הצבעים של הכפתורים והכל בכל העמודים הם דוג' בלבד
export const CustomersList = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [customers, setCustomers] = useState<Customer[]>();

    const fetchCustomers = async () => {
        setIsLoading(true)
        await getAllCustomers()
            .then((data) => {
                console.log(data);

                setCustomers(data);
                setIsLoading(false)

                console.log("successfully get customers");

            }).catch((error: Error) => {
                console.error('Error fetching customers:', error);
            });
    }

    useEffect(() => {
        fetchCustomers();

        //לבדוק למה לא עובד המשתני סביבה!!!
        // האזנה לשינויים בטבלת customers
        // const channel = supabase
        //     .channel('public:customers')
        //     .on(
        //         'postgres_changes',
        //         { event: '*', schema: 'public', table: 'customers' },
        //         (payload) => {
        //             // כל שינוי (הוספה, עדכון, מחיקה) יגרום לרענון הרשימה
        //             fetchCustomers();
        //         }
        //     )
        //     .subscribe();

        // // ניקוי מאזין כשיוצאים מהקומפוננטה
        // return () => {
        //     supabase.removeChannel(channel);
        // };
    }, []);

    const getValuseToTable = () => {
        const valuesToTable: ValuesToTable[] = customers!.map(customer => ({
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            status: <div className="flex justify-between">
                {statusLabels[customer.status]}
                {/* כדאי במקום לכתוב עדכון - לסים אייקון של עריכה */}
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`updateStatus/${customer.id}`)}>
                    עדכון
                </Button>
            </div>,

        }));
        return valuesToTable;
    }

    //יצירת מערך עם ערכים המתאימים לטבלה


    const Columns: TableColumn<ValuesToTable>[] = [
        { header: "שם", accessor: "name" },
        { header: "פלאפון", accessor: "phone" },
        { header: "מייל", accessor: "email" },
        { header: "סטטוס", accessor: "status" },
    ];

    const deleteCurrentCustomer = async (val: ValuesToTable) => {

        const customerId = val.id;
        await deleteCustomer(customerId)
            .then(() => {
                //לאחר שיהיה את העדכון האוטומטי לא צריך את זה
                fetchCustomers()
                alert("customer deleted successfully");
            })
            .catch((error: Error) => {
                console.error("Error deleting customer:", error);
                alert("Failed to delete customer. Please try again.");
            });
        // const newCustomers = customers.filter(customer => customer.id !== customerId);
        // setCustomers(newCustomers); // עדכון ה-state

    }

    const editCustomer = (val: ValuesToTable) => {
        navigate("update", { state: { data: customers!.find(customer => customer.id == val.id) } })
        //כאן יפתח טופס מאותחל בכל הפרטים הנוכחחים עם אפשרות לשנות
    }

    const searchCustomer = () => {

        //חיפוש לקוח לפי הערך שהוזן באינפוט
        //שימוש בפונצקית חיפוש המוכנה
        //אפשר לעשות יותר מתקדם עם בחירה וכו לפי הדרישה
    }

    return (
        <>
            {isLoading && <h2 className="text-3xl font-bold text-center text-blue-600 my-4">Loading...</h2>}
            {!isLoading && <div className="p-6">
                <h2 className="text-3xl font-bold text-center text-blue-600 my-4">לקוחות</h2>

                {/* שימוש בקומפוננטה של יצוא לאקסל */}
                <ExportToExcel data={customers!} fileName="לקוחות" /><br /> <br />
                {/* <Button variant="primary" size="sm" onClick={() => navigate('intersections')}>אינטראקציות של לקוחות</Button><br /> */}

                {/* אפשרות חיפוש - בחירה לפי מה לחפש ושדה להכנסת ערך לחיפוש - אפשר בקומפוננטה נפרדת */}
                <input type="text" placeholder="הכנס ערך לחיפוש" />
                {/* לא חייבים את הכפתור אפשר בכל לחיצת מקלדת של קלט לחפש */}
                <Button variant="secondary" size="sm" onClick={() => searchCustomer()}>חיפוש</Button>

                {/* טבלה של כל הלקוחות עם שם וסטטוס ולכל אחד קישור לקומפוננטה של לקוח בודד שתציג את כל הפרטים המלאים שלו */}

                <Table<ValuesToTable>
                    data={getValuseToTable()}
                    columns={Columns}
                    // dir="rtl"
                    onDelete={deleteCurrentCustomer}
                    onUpdate={editCustomer}
                    renderActions={(row) => (
                        <>
                            {/* לא בטוח שצריך את הדברים האלה!!!! */}
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
            }
        </>
    );
}

