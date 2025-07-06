import { useNavigate } from "react-router-dom";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { SearchLeads } from "./SearchLeads";
import { Lead } from "shared-types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { deleteLead } from "../../service/LeadAndCustomersService";
import { LeadsTable } from "./LeadsTable"; // 💡 ודאי שהשמות תואמים

export const LeadsHomePage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const allLeadsRef = useRef<Lead[]>([]);

  const fetchLeads = async (page: number, limit: number = 50) => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/leads/by-page", {
        params: { page, limit },
      });

      if (data.length < limit) setHasMore(false);

      setLeads((prev) => [...prev, ...data]);
      allLeadsRef.current = [...allLeadsRef.current, ...data];
    } catch (error) {
      console.error("שגיאה בשליפת מתעניינים:", error);
    }
  };

  useEffect(() => {
    if (!isSearching) fetchLeads(page);
  }, [page, isSearching]);

  useEffect(() => {
    if (!loaderRef.current || isSearching) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isSearching, hasMore]);

 const handleSearch = (term: string) => {
  console.log("🔍 Searching for term:", term);

  setSearchTerm(term);

  if (!term.trim()) {
    setIsSearching(false);
    setLeads(allLeadsRef.current);
    return;
  }

  const filtered = allLeadsRef.current.filter(
    (l) =>
      l.name.toLowerCase().includes(term.toLowerCase()) ||
      l.phone.includes(term) ||
      l.email.toLowerCase().includes(term.toLowerCase())
  );

  if (filtered.length > 0) {
    setIsSearching(true);
    setLeads(filtered);
  } else {
    // חיפוש בשרת - אם אין תוצאות גם מהשרת, נציג מערך ריק במקום להציג את כל הרשימה
    axios
      .get("http://localhost:3001/api/leads/search", {
        params: { q: term },
      })
      .then((res) => {
        setIsSearching(true);
        if (res.data.length > 0) {
          setLeads(res.data);
        } else {
          // אם גם מהשרת אין תוצאות, נקבע מערך ריק
          setLeads([]);
        }
      })
      .catch((err) => {
        console.error("שגיאה בחיפוש מהשרת:", err);
        // במקרה של שגיאה אפשר להחליט מה להציג — למשל גם מערך ריק
        setLeads([]);
      });
  }
};


  const deleteCurrentLead = async (id: string) => {
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      allLeadsRef.current = allLeadsRef.current.filter((l) => l.id !== id);
      alert("מתעניין נמחק בהצלחה");
    } catch (error) {
      console.error("שגיאה במחיקה:", error);
      alert("מחיקה נכשלה");
    }
  };

  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      <h2 className="text-3xl font-bold text-center text-blue-600 my-4">מתעניינים</h2>
      <Button variant="primary" size="sm" onClick={() => navigate("intersections")}>
        אינטראקציות של מתעניינים
      </Button>
      <Button
        onClick={() => navigate("interestedCustomerRegistration")}
        variant="primary"
        size="sm"
      >
        הוספת מתעניין חדש
      </Button>
      <br /><br />
      <SearchLeads term={searchTerm} setTerm={setSearchTerm} onSearch={handleSearch} />
      <LeadsTable leads={leads} onDelete={deleteCurrentLead} />
      <div ref={loaderRef} style={{ height: "1px" }} />
    </div>
  );
};
