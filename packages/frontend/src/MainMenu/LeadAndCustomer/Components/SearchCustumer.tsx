import { Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { Person, Customer } from "shared-types";
import axios from "axios";
// import { CustomerStatus, WorkspaceType, PaymentMethodType } from "shared-types";

interface SearchCustomerProps {
  onResults: (results: Person[]) => void;
}

export const SearchCustomer = ({ onResults }: SearchCustomerProps) => {
  const [data, setData] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onResults(data);
    console.log("Data updated in SearchCustomer:", data);
  }, [data]);

  // useEffect(() => {
  //     const fetchItems = async () => {
  //         const dummyItems: Customer[] = Array.from({ length: 6 }, (_, i) => {
  //             const id = (page * 6 + i).toString();
  //             return {
  //                 id,
  //                 name: `לקוח ${id}`,
  //                 phone: `050-123456${i}`,
  //                 email: `customer${id}@example.com`,
  //                 idNumber: `12345678${i}`,
  //                 businessName: `עסק ${id}`,
  //                 businessType: "חברה בע\"מ",
  //                 status: CustomerStatus.ACTIVE,
  //                 currentWorkspaceType: WorkspaceType.DESK_IN_ROOM,
  //                 workspaceCount: 1 + (i % 3),
  //                 contractSignDate: `2023-0${(i % 9) + 1}-01`,
  //                 contractStartDate: `2023-0${(i % 9) + 1}-10`,
  //                 billingStartDate: `2023-0${(i % 9) + 1}-15`,
  //                 notes: `הערה ללקוח ${id}`,
  //                 invoiceName: `חשבונית ${id}`,
  //                 contractDocuments: [],
  //                 paymentMethods: [],
  //                 paymentMethodsType: PaymentMethodType.BANK_TRANSFER,
  //                 periods: [],
  //                 createdAt: `2023-0${(i % 9) + 1}-01`,
  //                 updatedAt: `2023-0${(i % 9) + 1}-02`,
  //             };
  //         });

  //         setData((prev) => [...prev, ...dummyItems]);
  //         if (page >= 3) setHasMore(false);
  //     };

  //     fetchItems();
  // }, [page]);

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

  const normalizeDate = (input: string): string | null => {
    const clean = input.trim().replace(/\s+/g, "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

    const match = clean.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const parsed = new Date(clean);
    return !isNaN(parsed.getTime()) ? parsed.toISOString().split("T")[0] : null;
  };

  const isHebrew = (text: string): boolean => /^[\u0590-\u05FF\s]+$/.test(text);

  const handleSearch = async (input = searchTerm.trim(), fromServer = true) => {
    console.log(
      "handleSearch called with input:",
      input,
      "fromServer:",
      fromServer
    );
    if (!input) {
      setSearchTerm("");
      onResults([]);
      console.log(onResults);

      return;
    }

    try {
      if (fromServer) {
        const response = await axios.get(
          "http://localhost:3001/api/customers/filter",
          {
            params: {
              name: "6",
              page: 1,
              limit: 10,
            },
          }
        );
        console.log("Response data:", response.data);
        const fetchedData = response.data as Customer[];
        console.log("Fetched data:", fetchedData);
        setData(fetchedData);
      } else {
        // חיפוש מקומי בדאטה קיימת
        const filtered = data.filter((person) =>
          person.name.toLowerCase().includes(input.toLowerCase())
        );
        setData(filtered);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }

    let searchValue = input;

    if (!isHebrew(searchValue)) {
      console.log("הקלט לא בעברית, מדלגים על תרגום זמנית");
    }

    setSearchTerm(input);

    const lower = searchValue.toLowerCase();
    const parsedDate = normalizeDate(searchValue);

    const filtered = data.filter((person) => {
      const nameMatch = person.name.toLowerCase().includes(lower);
      const emailMatch = person.email.toLowerCase().includes(lower);
      const phoneMatch = person.phone.toLowerCase().includes(lower);
      const statusMatch = person.status.toLowerCase().includes(lower);

      let dateMatch = false;

      if ("status" in person && "currentWorkspaceType" in person) {
        if (parsedDate) {
          const normalizedDate = normalizeDate(
            (person as Customer).contractSignDate!
          );
          dateMatch = normalizedDate === parsedDate;
        }
      }

      return nameMatch || dateMatch || statusMatch || emailMatch || phoneMatch;
    });

    onResults(filtered);
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
            handleSearch(value, true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchTerm, true);
            }
          }}
        />
      </Stack>
      <div ref={loaderRef} style={{ height: "1px" }} />
    </div>
  );
};
