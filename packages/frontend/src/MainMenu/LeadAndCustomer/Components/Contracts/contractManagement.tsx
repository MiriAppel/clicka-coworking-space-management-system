import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { useNavigate } from 'react-router-dom';
import type{ Contract, ID } from "shared-types";
import { ContractStatus, WorkspaceType } from "shared-types";
import { Button, ButtonProps } from "../../../../Common/Components/BaseComponents/Button";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";

interface ValuesToTable {
    customerId: ID; //  מזהה הלקוח בעל החוזה -כדאי להחליף לשם שלו
    status: ContractStatus; // סטטוס החוזה
    linkToDetails: React.ReactElement; // קישור לפרטים של החוזה
    deleteButton: ButtonProps; // כפתור למחיקת החוזה - או שהמחיקה תהיה מתוך פרטי החוזה
}

export const ContractManagement = () => {

    const navigate = useNavigate()

    const [contracts, setContracts] = useState<Contract[]>([
        {
            id: '1', // יש להחליף עם ID אמיתי
            customerId: '101', // יש להחליף עם ID אמיתי
            version: 1,
            status: ContractStatus.DRAFT,
            startDate: new Date().toISOString(), // תאריך התחלה נוכחי
            terms: {
                workspaceType: WorkspaceType.DESK_IN_ROOM, // יש להחליף עם WorkspaceType אמיתי
                workspaceCount: 5,
                monthlyRate: 1500,
                duration: 12,
                renewalTerms: 'Automatic renewal every year',
                terminationNotice: 30,
            },
            documents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: '2', // יש להחליף עם ID אמיתי
            customerId: '102', // יש להחליף עם ID אמיתי
            version: 1,
            status: ContractStatus.PENDING_SIGNATURE,
            startDate: new Date().toISOString(), // תאריך התחלה נוכחי
            terms: {
                workspaceType: WorkspaceType.OPEN_SPACE, // יש להחליף עם WorkspaceType אמיתי
                workspaceCount: 2,
                monthlyRate: 800,
                duration: 6,
                renewalTerms: 'No automatic renewal',
                terminationNotice: 15,
            },
            documents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ]);

    const valuesToTable: ValuesToTable[] = contracts.map(contract => ({
        customerId: contract.customerId,
        status: contract.status,
        //להוסיף כאן אפשרות לעדכון סטטוס שיפתח אפשרות לבחירה מתוך רשימה והפעלת פונצקיה לעדכון
        linkToDetails: <NavLink to={`:${contract.customerId}`}>פרטי חוזה</NavLink>, // קישור
        deleteButton: (
            <Button variant="primary" size="sm" onClick={() => deleteContract(contract.id!)}>X</Button>
        ),
    }));

    const Columns: TableColumn<ValuesToTable>[] = [
        { header: "מזהה הלקוח", accessor: "customerId" }, // כדאי לשנות לשם הלקוח
        { header: "סטטוס", accessor: "status" },
        { header: "פרטים", accessor: "linkToDetails" },
        { header: "מחיקה", accessor: "deleteButton" }
    ];

    const deleteContract = (id: string) => {
        //כאן יהיה קריאת שרת למחיקת חוזה ועדכון מחדש של המערך המקומי
        //זה רק דוג' למחיקה מקומית
        const newCustomers = contracts.filter(c => c.id !== id);
        setContracts(newCustomers); // עדכון ה-state

    }

    return (
        <div>
            <h1>Contract Management</h1>
            {/* Add your contract management implementation here */}
            <Button variant="primary" size="sm" onClick={() => navigate('new')}>new contract</Button>

            {/* כאן יהיה טבלה של כל החוזים עם הפרטים (אם זה מדי הרבה פרטים ולא יפה לעשות הכל כאן אפשר לנתב לעמוד של פרטי חוזה בודד) */}

            <Table<ValuesToTable> data={valuesToTable} columns={Columns} dir="rtl" />

        </div>

    );
}
