import { Button } from "../../../../Common/Components/BaseComponents/Button";
import {
    Table,
    TableColumn,
} from "../../../../Common/Components/BaseComponents/Table";
import { Expense } from "shared-types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ExpenseDetails } from "./expenseDetails";

// טבלת ערכים
interface ValuesToTable {
    id: string;
    vendor_name: string;
    category: string;
    amount: number;
    status: string;
    date: string;
}

export const ExpenseList = () => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // שליפה ראשונית מהשרת
    const fetchExpenses = async () => {
        axios
            .get("http://localhost:3001/api/expenses/by-page", {
                params: { page, limit: 50 },
            })
            .then((response) => {
                if (response.data.length < 50) {
                    setHasMore(false);
                }
                setExpenses((prev) => {
                    const ids = new Set(prev.map((e) => e.id));
                    const uniqueNew = response.data.filter(
                        (expense: Expense) => !ids.has(expense.id)
                    );
                    return [...prev, ...uniqueNew];
                });
                setAllExpenses((prev) => {
                    const ids = new Set(prev.map((e) => e.id));
                    const uniqueNew = response.data.filter(
                        (expense: Expense) => !ids.has(expense.id)
                    );
                    return [...prev, ...uniqueNew];
                });
            })
            .catch((error) => {
                console.error("Error fetching expenses:", error);
            });
    };

    useEffect(() => {
        fetchExpenses();
        // eslint-disable-next-line
    }, [page]);

    useEffect(() => {
        if (!loaderRef.current || !hasMore || isSearching) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });
        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, isSearching]);

    // חיפוש
    const handleSearch = (term: string) => {
        setSearchTerm(term);

        if (!term) {
            setIsSearching(false);
            setExpenses(allExpenses);
            setPage(1);
            setHasMore(true);
            return;
        }

        setIsSearching(true);

        const filtered = allExpenses.filter(
            (expense) =>
                expense.vendor_name?.toLowerCase().includes(term.toLowerCase()) ||
                expense.description?.toLowerCase().includes(term.toLowerCase()) ||
                expense.category?.toLowerCase().includes(term.toLowerCase())
        );

        if (filtered.length > 0) {
            setExpenses(filtered);
        } else {
            axios
                .get("http://localhost:3001/api/expenses/filter", {
                    params: { q: term, page: 1, limit: 50 },
                })
                .then((response) => {
                    setExpenses(response.data);
                })
                .catch((error) => {
                    console.error("Error searching from server:", error);
                });
        }
    };

    // מחיקת הוצאה
    const deleteCurrentExpense = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3001/api/expenses/${id}`);
            setExpenses([]);
            setAllExpenses([]);
            setPage(1);
            setHasMore(true);
            fetchExpenses();
            alert("הוצאה נמחקה בהצלחה");
        } catch (error) {
            console.error("שגיאה במחיקת הוצאה:", error);
            alert("מחיקה נכשלה");
        }
    };

    // טבלת ערכים
    const valuesToTable: ValuesToTable[] = expenses.map((expense) => ({
        id: expense.id!,
        vendor_name: expense.vendor_name,
        category: expense.category,
        amount: expense.amount,
        status: expense.status,
        date: new Date(expense.date).toLocaleDateString("he-IL"),
    }));

    // עמודות כולל כפתור "פרטים"
    const Columns: TableColumn<ValuesToTable>[] = [
        { header: "ספק", accessor: "vendor_name" },
        { header: "קטגוריה", accessor: "category" },
        { header: "סכום", accessor: "amount" },
        { header: "סטטוס", accessor: "status" },
        { header: "תאריך", accessor: "date" },
        {
            header: "פרטים",
            accessor: "id",
            render: (value, row) => (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>  setSelectedId(row.id)}
                >
                    פרטים
                </Button>
            ),
        },
    ];

    return (
        <div style={{ direction: "rtl", padding: "20px" }}>
            <h2 className="text-3xl font-bold text-center text-blue-600 my-4">הוצאות</h2>
            <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("expense-form")}
            >
                הוספת הוצאה חדשה
            </Button>
            <br />
            <br />
            {/* שדה חיפוש פשוט */}
            <input
                type="text"
                placeholder="חפש לפי ספק, תיאור או קטגוריה"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ padding: "8px", width: "250px", marginBottom: "16px" }}
            />
            <Table<ValuesToTable>
                data={valuesToTable}
                columns={Columns}
                onDelete={(val) => deleteCurrentExpense(val.id)}
                onUpdate={(val) => {
                    navigate(`/expenses/expense-form/${val.id}`);
                }}
                renderActions={() => null}
            />
            {selectedId && (
    <ExpenseDetails id={selectedId} onClose={() => setSelectedId(null)} />
)}
            <div ref={loaderRef} style={{ height: "1px" }} />
        </div>
    );
};
