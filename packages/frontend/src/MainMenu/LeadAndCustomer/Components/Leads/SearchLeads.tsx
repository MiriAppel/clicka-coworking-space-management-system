// import { TextField } from "@mui/material";
// import { useEffect, useRef } from "react";
// import debounce from "lodash/debounce";

// interface SearchLeadsProps {
//   term: string;
//   setTerm: (term: string) => void;
//   onSearch: (term: string) => void;
// }

// export const SearchLeads = ({ term, setTerm, onSearch }: SearchLeadsProps) => {
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const debouncedSearch = useRef(
//     debounce((value: string) => {
//       onSearch(value);
//     }, 300)
//   ).current;

//   useEffect(() => {
//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [debouncedSearch]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setTerm(value);
//     debouncedSearch(value);
//   };

//   const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       debouncedSearch.cancel();
//       onSearch(term);
//     }
//   };

//   return (
//     <TextField
//       fullWidth
//       label="חפש מתעניין"
//       variant="outlined"
//       value={term}
//       onChange={handleChange}
//       onKeyDown={handleEnter}
//       inputRef={inputRef}
//     />
//   );
// };


import { TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import { LeadStatus } from "shared-types"; // יבוא סטטוסים 

interface SearchLeadsProps {
  term: string;
  setTerm: (term: string) => void;
  onSearch: (term: string, status?: string) => void; // 👈 נוסיף גם סטטוס
  status: string;//חדש
  setStatus: (status: string) => void;//חדש
}

export const SearchLeads = ({ term, setTerm, onSearch, status, setStatus }: SearchLeadsProps) => {//✔ הוספתי את status ו־setStatus גם בחתימת הפונקציה:
  const inputRef = useRef<HTMLInputElement | null>(null);

  const statusTranslations: Record<string, string> = {
  NEW: "חדש",
  CONTACTED: "נוצר קשר",
  INTERESTED: "מעוניין",
  SCHEDULED_TOUR: "נקבע סיור",
  PROPOSAL_SENT: "נשלחה הצעה",
  CONVERTED: "הומר ללקוח",
  NOT_INTERESTED: "לא מעוניין",
  LOST: "אבד"
};


  const leadStatuses = Object.values(LeadStatus);//כדי להציג את הסטטוסים בסלקט יש צורך להמיר
  const debouncedSearch = useRef(
    debounce((value: string, statusValue: string) => {
      onSearch(value, statusValue);
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    debouncedSearch(value, status);
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      debouncedSearch.cancel();
      onSearch(term, status);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
       console.log("סטטוס נבחר:", newStatus);
    setStatus(newStatus);
    debouncedSearch(term, newStatus);
  };
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <TextField
        fullWidth
        label="חפש מתעניין"
        variant="outlined"
        value={term}
        onChange={handleChange}
        onKeyDown={handleEnter}
        inputRef={inputRef}
      />
    <select value={status} onChange={handleStatusChange}>
  <option value="">כל הסטטוסים</option>
  {leadStatuses.map((s) => (
    <option key={s} value={s}>
      {statusTranslations[s] || s}
    </option>
  ))}
</select>

    </div>
  );
};