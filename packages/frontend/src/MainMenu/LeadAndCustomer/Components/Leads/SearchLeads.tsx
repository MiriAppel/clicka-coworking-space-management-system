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
interface SearchLeadsProps {
  term: string;
  setTerm: (term: string) => void;
  onSearch: (term: string) => void;
}
export const SearchLeads = ({ term, setTerm, onSearch }: SearchLeadsProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debouncedSearch = useRef(
    debounce((value: string) => {
      onSearch(value);
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
    debouncedSearch(value);
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      debouncedSearch.cancel();
      onSearch(term);
    }
  };
  return (
    <TextField
      fullWidth
      label="חפש מתעניין"
      variant="outlined"
      value={term}
      onChange={handleChange}
      onKeyDown={handleEnter}
      inputRef={inputRef}
    />
  );
};