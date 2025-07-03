import { Stack, TextField } from "@mui/material";
import { useState } from "react";

interface SearchLeadsProps {
  onSearch: (searchTerm: string) => void;
  term: string; // Optional prop to set initial search term
  setTerm: (term: string) => void; // Optional prop to set search term
}

export const SearchLeads = ({ onSearch, term, setTerm}: SearchLeadsProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value); // חיפוש אוטומטי בכל שינוי
  };

  return (
    <Stack spacing={2} direction="row">
      <TextField
        label="חיפוש"
        fullWidth
        value={term}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(term); 
          }
        }}
      />
    </Stack>
  );
};