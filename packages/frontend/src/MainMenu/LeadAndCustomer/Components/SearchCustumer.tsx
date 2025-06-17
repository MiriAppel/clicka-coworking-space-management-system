import {
    Button,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { Person } from "../Classes/Person";
import { Customer } from "../Classes/Customer";
import { Lead } from "../Classes/Lead";
import { CustomerStatus, WorkspaceType } from "../types/customer";

interface StoreState {
    query: string;
    results: Person[];
    setQuery: (query: string) => void;
    setResults: (results: Person[]) => void;
}

const useStore = create<StoreState>((set) => ({
    query: '',
    results: [],
    setQuery: (query: string) => set({ query }),
    setResults: (results: Person[]) => set({ results }),
}));

export const SearchCustomer = () => {
    const { query, results, setQuery, setResults } = useStore();
    const [data, setData] = useState<Person[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            const dummyItems: Person[] = Array.from({ length: 6 }, (_, i) => {
                const id = (page * 6 + i).toString();
                return i % 2 === 0
                    ? new Customer({
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
                    })
                    : new Lead({
                        id,
                        name: `ליד ${id}`,
                        email: `lead${id}@example.com`,
                        phone: `050-5678${id.padStart(2, '0')}`,
                        createdAt: "2024-02-01",
                    });
            });

            setData((prev) => [...prev, ...dummyItems]);
            if (page >= 3) setHasMore(false);
        };

        fetchItems();
    }, [page]);

    useEffect(() => {
        if (!loaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore]);

    const checkInputType = (input:string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // טלפון ישראלי לדוגמה: 05X-XXXXXXX או 05XXXXXXXX
        const phoneRegex = /^05\d[-]?\d{7}$/;

        if (emailRegex.test(input)) {
            return 'email';
        } else if (phoneRegex.test(input)) {
            return 'phone';
        } else {
            return 'text';
        }
    }

    const searchFromServer = async (input: string) => {
        try {
            const type = checkInputType(input)
            const res = await fetch(`/api/customers/search?query=${encodeURIComponent(type)}`);
            const data = await res.json();
            //כרגע כשאין API
            handleSearch(input,false)
            const items: Person[] = data.map((item: any) =>
                item.type === 'customer' ? new Customer(item) : new Lead(item)
            );

            setResults(items);
        } catch (err) {
            console.error("שגיאה בחיפוש:", err);
        }
    };

    function normalizeDate(input: string): string | null {
        const clean = input.trim().replace(/\s+/g, "");

        if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

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

    const handleSearch = async (input = searchTerm.trim(), fromServer = false) => {
        setQuery(input);
        setSearchTerm(input);

        if (input === '') {
            setResults([]);
            return;
        }

        if (fromServer) {
            await searchFromServer(input);
        } else {
            const lower = input.toLowerCase();
            const parsedDate = normalizeDate(input);

            const filtered = data.filter((person) => {
                const nameMatch = person.name.toLowerCase().includes(lower);
                const emailMatch = person.email.toLowerCase().includes(lower);
                const phoneMatch = person.phone.includes(input);

                let dateMatch = false;
                let statusMatch = false;
                let workspaceMatch = false;

                if (person instanceof Customer) {
                    if (parsedDate) {
                        const normalizedDate = normalizeDate(person.contractSignDate!);
                        dateMatch = normalizedDate === parsedDate;
                    }

                    statusMatch = person.status.some((s) =>
                        s.toLowerCase().includes(lower)
                    );

                    workspaceMatch = person.currentWorkspaceType.some((w) =>
                        w.toLowerCase().includes(lower)
                    );
                }

                return nameMatch || emailMatch || phoneMatch || dateMatch || statusMatch || workspaceMatch;
            });

            setResults(filtered);
        }
    };


    return (
        <div>
            <Stack spacing={2} direction="row">
                <TextField
                    label="חיפוש"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleSearch(value, false);
                    }}

                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch(searchTerm, true);
                        }
                    }}
                ></TextField>
                <Button onClick={() => handleSearch(searchTerm, true)}>חפש</Button>
            </Stack>

            <List>
                {results.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${item.name} | ${item.email} | ${item.phone} ${item instanceof Customer
                                ? `| ${item.status.join(", ")} | ${item.currentWorkspaceType.join(", ")} | ${item.contractStartDate}`
                                : ""
                                }`}
                        />
                    </ListItem>
                ))}
            </List>

            <div ref={loaderRef} style={{ height: "1px" }} />
        </div>
    );
};
