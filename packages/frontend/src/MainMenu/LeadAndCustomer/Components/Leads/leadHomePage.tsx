import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import {
  Table,
  TableColumn,
} from "../../../../Common/Components/BaseComponents/Table";
import { Lead } from "shared-types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SearchLeads } from "./SearchLeads";

interface ValuesToTable {
  id: string;
  name: string;
  status: string;
  phone: string;
  email: string;
  linkToDetails: React.ReactElement;
  deleteButton: React.ReactElement;
}

interface LeadsListProps {
  leads: Lead[];
  onDelete: (id: string) => void;
}

export const LeadHomePage = ({ leads, onDelete }: LeadsListProps) => {
  const navigate = useNavigate();

  const valuesToTable: ValuesToTable[] = leads.map((lead) => ({
    id: lead.id!,
    name: lead.name,
    status: lead.status,
    phone: lead.phone,
    email: lead.email,
    linkToDetails: <NavLink to={`:${lead.id}`}>פרטי לקוח</NavLink>,
    deleteButton: (
      <Button variant="primary" size="sm" onClick={() => onDelete(lead.id!)}>
        X
      </Button>
    ),
  }));

  const columns: TableColumn<ValuesToTable>[] = [
    { header: "שם", accessor: "name" },
    { header: "סטטוס", accessor: "status" },
    { header: "פלאפון", accessor: "phone" },
    { header: "מייל", accessor: "email" },
  ];

  return (
    <div className="p-6">
      <Button
        variant="primary"
        size="sm"
        onClick={() => navigate("intersections")}
      >
        אינטראקציות של מתעניינים
      </Button>

      <Button
        onClick={() => navigate("interestedCustomerRegistration")}
        variant="primary"
        size="sm"
      >
        הוספת מתעניין חדש
      </Button>

      <Table<ValuesToTable>
        data={valuesToTable}
        columns={columns}
        onDelete={(val) => onDelete(val.id)}
        renderActions={(row) => (
          <NavLink
            state={{ data: leads.find((lead) => lead.id == row.id) }}
            to={`interestedCustomerRegistration`}
            className="text-blue-500 hover:underline ml-2"
          >
            לטופס רישום ללקוח
          </NavLink>
        )}
      />
    </div>
  );
};

export const LeadsPage = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // שליפה ראשונית מהשרת
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/leads/by-page", {
        params: { page, limit: 50 },
      })
      .then((response) => {
        if (response.data.length < 50) {
          setHasMore(false); // אין יותר נתונים
        }
        // עדכון הלידים שצריכים להופיע בדף
        setLeads((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const uniqueNew = response.data.filter(
            (lead: Lead) => !ids.has(lead.id)
          );
          return [...prev, ...uniqueNew];
        });

        // עדכון המאגר הכללי של הלידים
        setAllLeads((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const uniqueNew = response.data.filter(
            // מסנן לידים שלא קיימים כבר במאגר הכללי
            (lead: Lead) => !ids.has(lead.id)
          );
          return [...prev, ...uniqueNew];
        });
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
      });
  }, [page]);

  //
  useEffect(() => {
    if (!loaderRef.current || !hasMore || isSearching) return;

    // ברגע שהלידים עומדים להגמר זה עובר לעמוד הבא
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isSearching]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term) {
      setIsSearching(false);
      setLeads(allLeads);
      setPage(1); // מחזיר לעמוד הראשון
      setHasMore(true); // מאפס את הסטטוס של יש עוד עמוד
      return;
    }

    setIsSearching(true);

    // סינון תומך באותיות קטנות וגדולות
    // מחפש גם לפי שם, פלאפון ודוא"ל
    // אם לא מצא תוצאות, שולח בקשה לשרת
    const filtered = allLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(term.toLowerCase()) ||
        lead.phone.includes(term) ||
        lead.email.toLowerCase().includes(term.toLowerCase())
    );

    if (filtered.length > 0) {
      setLeads(filtered);
    } else {
      axios
        .get("http://localhost:3001/api/leads/filter", {
          params: { q: term, page: 1, limit: 50 },
        })
        .then((response) => {
          setLeads(response.data);
        })
        .catch((error) => {
          console.error("Error searching from server:", error);
        });
    }
  };

  const handleDeleteLeads = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setAllLeads((prev) => prev.filter((l) => l.id !== id)); // גם מהמאגר הכללי
  };

  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      <h1>מתעניינים</h1>
      <SearchLeads onSearch={handleSearch} />
      <LeadHomePage leads={leads} onDelete={handleDeleteLeads} />
      <div ref={loaderRef} style={{ height: "1px" }} />
    </div>
  );
};
