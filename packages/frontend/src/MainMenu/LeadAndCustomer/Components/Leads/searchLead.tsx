import { Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { Person, Lead } from "shared-types";
import axios from "axios";
interface SearchLeadsProps {
  onResults: (results: Person[]) => void;
}
export const SearchLeads = ({ onResults }: SearchLeadsProps) => {
  const [data, setData] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // שלח תוצאות עדכניות לפרופס
  useEffect(() => {
    onResults(data);
  }, [data]);
  // חיפוש לפי טקסט
  useEffect(() => {
    setPage(1);
    setData([]);
    setHasMore(true);
  }, [searchTerm]);
  // טעינה אינסופית
  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, isLoading]);
  // פנייה לשרת
  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/api/leads/filter", {
          params: {
            q: searchTerm,
            page,
            limit: 10,
          },
        });
        const fetched = response.data as Lead[];
        setData((prev) => (page === 1 ? fetched : [...prev, ...fetched]));
        if (fetched.length < 10) setHasMore(false);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, [page, searchTerm]);
  return (
    <div>
      <Stack spacing={2} direction="row">
        <TextField
          label="חיפוש"
          fullWidth
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchTerm(searchTerm); // Trigger new search
            }
          }}
        />
      </Stack>
      <div ref={loaderRef} style={{ height: "1px" }} />
    </div>
  );
};
// import { Stack, TextField } from "@mui/material";
// import { useState } from "react";
// interface SearchLeadsProps {
//   onSearch: (searchTerm: string) => void;
// }
// export const SearchLeads = ({ onSearch }: SearchLeadsProps) => {
//   const [term, setTerm] = useState("");
//   return (
//     <Stack spacing={2} direction="row">
//       <TextField
//         label="חיפוש"
//         fullWidth
//         value={term}
//         onChange={(e) => setTerm(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             onSearch(term);
//           }
//         }}
//       />
//     </Stack>
//   );
// };