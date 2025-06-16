import { Button, List, ListItem, ListItemText, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { Person } from "../Classes/Person";
import { Customer } from "../Classes/Customer";
import { Lead } from "../Classes/Lead";
import { CustomerStatus, WorkspaceType } from "../types/customer";

const persons: Person[] = [

]

type Store = {
    query: string;
    results: Person[];
    setQuery: (query: string) => void;
    setResults: (results: Person[]) => void;
};

const useStore = create<Store>((set) => ({
    query: '',
    results: [],
    setQuery: (query) => set({ query }),
    setResults: (results) => set({ results }),
}));


export const SearchCustomer = () => {
    const { query, results, setQuery, setResults } = useStore();
    //הרשימה שמתעדכנת כל הזמן בעוד נתונים מהשרת בגלילה
    const [data, setData] = useState<Person[]>(persons);
    //ערך תיבת הטקסט לחפוש
    const [search, setSearch] = useState('')
    //באיזה עמוד אוחזים בשליפת הנתונים מה - api
    const [page, setPage] = useState(1);
    //האם יש עוד נתונים
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    // useEffect(() => {
    //     //הפונקציה ששולפת למעשה
    //     const fetchItems = async () => {
    //         const res = await fetch(`/api/items?page=${page}`);
    //         const newItems = await res.json();
    //         setData([...newItems]);
    //         if (newItems.length === 0) setHasMore(false);
    //     };

    //     fetchItems();
    // }, [page]);
    useEffect(() => {
        const fetchItems = async () => {
            const dummyItems: Person[] = Array.from({ length: 6 }, (_, i) => {
                const id = (page * 6 + i).toString();

                if (i % 2 === 0) {
                    // כל זוגי – לקוח
                    return new Customer({
                        id,
                        name: `לקוח ${id}`,
                        email: `customer${id}@example.com`,
                        phone: `050-1234${id.padStart(2, '0')}`,
                        businessType: "משרד",
                        currentWorkspaceType: [WorkspaceType.OPEN_SPACE],
                        status: [CustomerStatus.ACTIVE],
                        contractStartDate: "2024-02-01",
                        contractSignDate: "01/02/2024",
                        createdAt: "2024-02-01",
                    });
                } else {
                    // כל אי-זוגי – ליד
                    return new Lead({
                        id,
                        name: `ליד ${id}`,
                        email: `lead${id}@example.com`,
                        phone: `050-5678${id.padStart(2, '0')}`,
                        createdAt: "2024-02-01",
                    });
                }
            });

            setData((prev) => [...prev, ...dummyItems]);

            if (page >= 3) setHasMore(false);
        };

        fetchItems();
    }, [page]);


    //הפונקציה שדואגת לגלילה האיטית
    useEffect(() => {
        if (!loaderRef.current || !hasMore) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });
        observer.observe(loaderRef.current);
        return () => {
            observer.disconnect();
        };
    }, [hasMore]);

    // ✅ פונקציה שמנסה לפרמט כל מחרוזת תאריך לצורה אחידה YYYY-MM-DD
    function normalizeDate(input: string): string | null {
        const clean = input.trim().replace(/\s+/g, "");

        // YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

        // DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
        const match = clean.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
        if (match) {
            const [, day, month, year] = match;
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }

        const parsed = new Date(clean);
        if (!isNaN(parsed.getTime())) {
            return parsed.toISOString().split("T")[0];
        }

        return null;
    }

    // ✅ פונקציה שממירה תאריך לפורמט אחיד לפני השוואה
    function normalizeAllDateFormats(date: string): string | null {
        return normalizeDate(date);
    }

    //פונקציית החפוש
    const handleSearch = (input = search.trim()) => {

        const queryTrimmed = search.trim();
        const queryLower = queryTrimmed.toLowerCase();

        let filteredResults: Person[] = [];

        // תאריך
        const parsedSearchDate = normalizeDate(input);
        if (parsedSearchDate) {
            filteredResults.push(
                ...data.filter((c) => {
                    if (c instanceof Customer) {
                        const normalizedCustomerDate = normalizeAllDateFormats(c.contractSignDate!);
                        return normalizedCustomerDate === parsedSearchDate;
                    }
                })
            );
        }

        // אימייל
        filteredResults.push(
            ...data.filter((c) => c.email.toLowerCase().includes(queryLower))
        );

        // טלפון
        filteredResults.push(
            ...data.filter((c) => c.phone.includes(input))
        );

        // סטטוס
        filteredResults.push(
            ...data.filter((c) => {
                if (c instanceof Customer && Array.isArray(c.status))
                    return c.status.some((s) => s?.toString().toLowerCase().includes(queryLower));
                return false;
            })
        );

        // סוג מרחב עבודה
        filteredResults.push(
            ...data.filter((c) => {
                if (c instanceof Customer && Array.isArray(c.currentWorkspaceType))
                    return c.currentWorkspaceType.some((w) => w?.toString().toLowerCase().includes(queryLower));
                return false;
            })
        );

        // שם
        filteredResults.push(
            ...data.filter((c) => c.name.toLowerCase().includes(queryLower))
        );

        // הסרת כפילויות לפי מחרוזת JSON
        const unique = Array.from(new Set(filteredResults.map((c) => JSON.stringify(c))))
            .map((s) => JSON.parse(s));

        setResults(unique);
    };

    return (
        <div>
            <Stack spacing={2} direction="row">
                <TextField
                    label="חיפוש"
                    fullWidth
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        setQuery(value);
                        handleSearch(value); // בזמן הקלדה
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch(); // אנטר
                        }
                    }}
                />
                <Button variant="contained" onClick={() => handleSearch()}>
                    חפש
                </Button>
            </Stack>

            <List>
                {results.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${item.name} | ${item.email} | ${item.phone} | ${item instanceof Customer ? item.status : ''} |
                            ${item instanceof Customer ? item.currentWorkspaceType : ''} | ${item instanceof Customer ? item.contractStartDate : ''}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};
