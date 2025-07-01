import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { NavLink } from "react-router";
import { ExportToExcel } from '../exportToExcel';
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { Customer, CustomerStatus } from "shared-types";
import { deleteCustomer, getAllCustomers } from "../../Service/LeadAndCustomersService";
import { Stack, TextField } from '@mui/material';
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
    ACTIVE: 'פעיל',
    NOTICE_GIVEN: 'הודעת עזיבה',
    EXITED: 'עזב',
    PENDING: 'בהמתנה',
};
export const CustomersList = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setIsLoading(false);
        }
    };
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
    const handleSearch = (term: string) => {
        const lower = term.toLowerCase();
        const filtered = customers.filter((c) =>
            c.name.toLowerCase().includes(lower) ||
            c.email.toLowerCase().includes(lower) ||
            c.phone.toLowerCase().includes(lower) ||
            statusLabels[c.status].toLowerCase().includes(lower)||
            c.businessName.toLowerCase().includes(lower)||
            c.businessType.toLowerCase().includes(lower)
        );
        return filtered;
    };
    const getValuseToTable = (): ValuesToTable[] => {
        return handleSearch(searchTerm).map(customer => ({
            id: customer.id!,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            status: (
                <div className="flex justify-between">
                    {statusLabels[customer.status]}
                    <Button variant="secondary" size="sm" onClick={() => navigate(`updateStatus/${customer.id}`)}>עדכון</Button>
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
        { header: "סוג עסק", accessor: "businessType" }
    ];
    const deleteCurrentCustomer = async (val: ValuesToTable) => {
        try {
            await deleteCustomer(val.id);
            fetchCustomers();
            alert("לקוח נמחק בהצלחה");
        } catch (error) {
            console.error("שגיאה במחיקת לקוח:", error);
            alert("מחיקה נכשלה");
        }
    };
    const editCustomer = (val: ValuesToTable) => {
        const selected = customers.find(c => c.id === val.id);
        navigate("update", { state: { data: selected } });
    };
    return (
        <>
            {isLoading ? (
                <h2 className="text-3xl font-bold text-center text-blue-600 my-4">טוען...</h2>
            ) : (
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-center text-blue-600 my-4">לקוחות</h2>
                    <ExportToExcel data={customers} fileName="לקוחות" /><br /><br />
                    <Stack spacing={2} direction="row">
                        <TextField
                            label="חיפוש"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                <NavLink to={`:${row.id}/dashboard`} className="text-blue-500 hover:underline ml-2">לוח בקרה</NavLink>
                                <NavLink to={`:${row.id}/contract`} className="text-blue-500 hover:underline ml-2">חוזה לקוח</NavLink>
                            </>
                        )}
                    />
                </div>
            )}
        </>
    );
};