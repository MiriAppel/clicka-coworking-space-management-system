// import React, { useEffect, useState } from "react";
// import { Button, ButtonProps } from '../../../../Common/Components/BaseComponents/Button';
// import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
// import axios from "axios";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Link, NavLink } from "react-router-dom";
// import { Lead, LeadSource, LeadStatus, Person } from "shared-types";
// import { SearchLeads } from "./searchLead";
// import { deleteLead } from "../../Service/LeadAndCustomersService";

// interface ValuesToTable {
//   id: string
//   name: string; // שם המתעניין
//   status: LeadStatus; // סטטוס המתעניין
//   phone: string; // פלאפון
//   email: string; // מייל
// }
// //צריך לעשות קריאת שרת לקבלת כל המתעניינים למשתנה הזה

import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { SearchLeads } from "./SearchLeads";
import { Lead } from "shared-types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LeadsTable } from "./LeadsTable";
import { deleteLead } from "../../Service/LeadAndCustomersService";

export const LeadsHomePage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(""); // סטטוס לחיפוש
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const allLeadsRef = useRef<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // שליפת לידים מדף מסוים
  const fetchLeads = async (page: number, limit: number = 50) => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/leads/by-page", {
        params: { page, limit },
      });

      if (data.length < limit) setHasMore(false);

      setLeads((prev) => [...prev, ...data]);
      allLeadsRef.current = [...allLeadsRef.current, ...data];
      setIsLoading(false);
    } catch (error) {
      console.error("שגיאה בשליפת מתעניינים:", error);
    }
  };

  // טעינת לידים כשהעמוד משתנה ואנחנו לא בחיפוש
  useEffect(() => {
    if (!isSearching) fetchLeads(page);
  }, [page, isSearching]);

  // אינטרסקשן אובזרבר לטעינת דפים נוספים (אינסופיניט סקרול)
  useEffect(() => {
    if (!loaderRef.current || isSearching) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isSearching, hasMore]);

  // פונקציית החיפוש עם לוגים
  const handleSearch = (term: string, searchStatus: string = "") => {
    console.log("handleSearch נקרא עם:", { term, searchStatus });
    console.log("לידים לפני סינון (allLeadsRef.current):", allLeadsRef.current);

    setSearchTerm(term);
    setStatus(searchStatus);

    // אם אין טקסט ואין סטטוס, מציגים את כל הלידים ללא סינון
    if (!term.trim() && !searchStatus) {
      console.log("אין טקסט ואין סטטוס — מחזירים את כל הלידים");
      setIsSearching(false);
      setLeads(allLeadsRef.current);
      return;
    }

    // סינון הלידים לפי טקסט וסטטוס
    const filtered = allLeadsRef.current.filter((l) => {
      console.log("התחלת סינון הלידים, כמות לידים:", allLeadsRef.current.length);

        const leadStatus = l.status?.toLowerCase().trim() || "";
  const searchStatus = status.toLowerCase().trim();
      // בדיקת טקסט - אם יש מונח חיפוש
      const textMatch = term
        ? l.name.toLowerCase().includes(term.toLowerCase()) ||
          l.phone.includes(term) ||
          l.email?.toLowerCase().includes(term.toLowerCase())
        : true;

      // בדיקת סטטוס - אם יש סטטוס לחיפוש
      const statusMatch = searchStatus
        ? l.status?.toLowerCase().trim() === searchStatus.toLowerCase().trim()
        : true;

      // לוג לבדיקה
      console.log(`בדיקה לליד id=${l.id}, status=${l.status}, textMatch=${textMatch}, statusMatch=${statusMatch}`);

      return textMatch && statusMatch;
    });

    console.log("לידים לאחר סינון:", filtered);

    if (filtered.length > 0) {
      setIsSearching(true);
      setLeads(filtered);
    } else {
      // חיפוש בשרת אם אין תוצאות בסינון מקומי
      axios
        .get("http://localhost:3001/api/leads/search", {
          params: { q: term },
        })
        .then((res) => {
          setIsSearching(true);
          if (res.data.length > 0) {
            setLeads(res.data);
          } else {
            setLeads([]);
          }
        })
        .catch((err) => {
          console.error("שגיאה בחיפוש מהשרת:", err);
          setLeads([]);
        });
    }
  };

  const deleteCurrentLead = async (id: string) => {
    try {
      // await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      allLeadsRef.current = allLeadsRef.current.filter((l) => l.id !== id);
      alert("מתעניין נמחק בהצלחה");
    } catch (error) {
      console.error("שגיאה במחיקה:", error);
      alert("מחיקה נכשלה");
    }
  };

  return (
    <>
      {isLoading ? (
        <h2 className="text-3xl font-bold text-center text-blue-600 my-4">
          טוען...
        </h2>
      ) : (
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
          <SearchLeads
            term={searchTerm}
            setTerm={setSearchTerm}
            status={status}
            setStatus={setStatus}
            onSearch={handleSearch}
          />
          <br /><br />
          <LeadsTable leads={leads} onDelete={deleteCurrentLead} />
          <div ref={loaderRef} style={{ height: "1px" }} />
        </div>
      )}
    </>
  );
};
