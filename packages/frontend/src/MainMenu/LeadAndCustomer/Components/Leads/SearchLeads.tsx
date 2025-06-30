import { Stack, TextField } from "@mui/material";
import { useState } from "react";

interface SearchLeadsProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchLeads = ({ onSearch }: SearchLeadsProps) => {
  const [term, setTerm] = useState("");

  return (
    <Stack spacing={2} direction="row">
      <TextField
        label="חיפוש"
        fullWidth
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(term);
          }
        }}
      />
    </Stack>
  );
};
