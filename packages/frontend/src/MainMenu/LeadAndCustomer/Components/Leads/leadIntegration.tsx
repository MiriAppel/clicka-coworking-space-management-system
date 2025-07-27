import { useEffect, useRef, useState } from "react";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { Lead } from "shared-types";
import { LeadInteractionDetails } from "./leadInteractionDetails";
import { SearchLeads } from "./SearchLeads";
import { number } from "yargs";

type SortField = "name" | "status" | "createdAt" | "updatedAt" | "lastInteraction";
type AlertCriterion = "noRecentInteraction" | "statusIsNew" | "oldLead";

export const LeadInteractions = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [alertCriterion, setAlertCriterion] = useState<AlertCriterion>("noRecentInteraction");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const allLeadsRef = useRef<Lead[]>([]);
  const {
    leads,
    fetchLeads,
    handleDeleteLead,
    handleSelectLead,
    resetSelectedLead,
  } = useLeadsStore();

  const selectedLead = useLeadsStore((state) => state.selectedLead);

 useEffect(() => {
  fetchLeads().then(() => {
    allLeadsRef.current = useLeadsStore.getState().leads;
  });
}, [page]); // לא fetchLeads – רק page
useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !isSearching
    ) {
      setPage((prevPage) => prevPage + 1); // יגרום ל־useEffect לעיל לקרוא שוב ל־fetchLeads
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [isSearching]);


  const handleSearch = (term: string) => {
  setSearchTerm(term);
  setPage(1);
  if (!term.trim()) {
    setIsSearching(false);
    useLeadsStore.setState({ leads: allLeadsRef.current });
    return;
  }

  const filtered = allLeadsRef.current.filter(
    (l) =>
      l.name?.toLowerCase().includes(term.toLowerCase()) ||
      l.phone?.includes(term) ||
      l.email?.toLowerCase().includes(term.toLowerCase())
  );

  if (filtered.length > 0) {
    setIsSearching(true);
    useLeadsStore.setState({ leads: filtered });
  } else {
    fetch(`${process.env.REACT_APP_API_UR}/leads/search?q=${term}`)
      .then((res) => res.json())
      .then((data: Lead[]) => {
        setIsSearching(true);
        useLeadsStore.setState({ leads: data.length > 0 ? data : [] });
      })
      .catch((err) => {
        console.error("שגיאה בחיפוש מהשרת:", err);
        useLeadsStore.setState({ leads: [] });
      });
  }
};

  const isAlert = (lead: Lead): boolean => {
    switch (alertCriterion) {
      case "noRecentInteraction":
        const recentThreshold = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
        return !lead.interactions?.some((i) =>
          new Date(i.updatedAt || i.createdAt || i.date) >= recentThreshold
        );
      case "statusIsNew":
        return lead.status?.toLowerCase() === "new";
      case "oldLead":
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return new Date(lead.createdAt || 0) < sixMonthsAgo;
      default:
        return false;
    }
  };

  const getSortValue = (lead: Lead): string | number | Date => {
    switch (sortField) {
      case "name":
        return lead.name?.toLowerCase() || "";
      case "status":
        return lead.status?.toLowerCase() || "";
      case "createdAt":
        return new Date(lead.createdAt || 0);
      case "updatedAt":
        return new Date(lead.updatedAt || 0);
      case "lastInteraction":
        const dates = lead.interactions?.map((i) => new Date(i.updatedAt || i.createdAt)) || [];
        return dates.length > 0 ? Math.max(...dates.map((d) => d.getTime())) : 0;
      default:
        return "";
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const aVal = getSortValue(a);
    const bVal = getSortValue(b);
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">מתעניינים</h2>

      <SearchLeads term={searchTerm} setTerm={setSearchTerm} onSearch={handleSearch} />

      <div className="flex flex-wrap justify-center gap-4 mb-6 mt-4">
        <div className="relative flex flex-col items-start">
          <label className="mb-1 text-sm font-medium text-gray-700">מיין לפי:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="border border-gray-300 rounded-xl bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="name">שם</option>
            <option value="status">סטטוס</option>
            <option value="createdAt">תאריך יצירה</option>
            <option value="updatedAt">תאריך עדכון</option>
            <option value="lastInteraction">אינטראקציה אחרונה</option>
          </select>
        </div>

        <div className="flex flex-col items-start">
          <label className="mb-1 text-sm font-medium text-gray-700">כיוון מיון:</label>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow transition"
          >
            {sortOrder === "asc" ? "⬆️ עולה" : "⬇️ יורד"}
            <span className="hidden sm:inline">
              ({sortOrder === "asc" ? "מהקטן לגדול" : "מהגדול לקטן"})
            </span>
          </button>
        </div>

        <div className="relative flex flex-col items-start">
          <label className="mb-1 text-sm font-medium text-gray-700">קריטריון התרעה:</label>
          <select
            value={alertCriterion}
            onChange={(e) => setAlertCriterion(e.target.value as AlertCriterion)}
            className="border border-gray-300 rounded-xl bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="noRecentInteraction">אין אינטראקציה אחרונה</option>
            <option value="statusIsNew">סטטוס חדש</option>
            <option value="oldLead">ליד ישן (לפני 6 חודשים)</option>
          </select>
        </div>
      </div>

      {sortedLeads.map((lead) => (
        <div
          key={lead.id}
          className={`border rounded-lg p-4 mb-2 cursor-pointer transition ${
            selectedLead?.id === lead.id
              ? "bg-blue-100 border-blue-300"
              : isAlert(lead)
              ? "border-red-500 bg-red-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() => {
            if (selectedLead?.id === lead.id) {
              resetSelectedLead();
            } else {
              handleSelectLead(lead.id!);
            }
          }}
        >
          <div className="flex flex-col gap-2">
            <div>
              <div className="font-semibold text-lg">{lead.name}</div>
              <div className="text-sm text-gray-600">סטטוס: {lead.status}</div>
            </div>
            {selectedLead?.id === lead.id && <LeadInteractionDetails />}
          </div>
        </div>
      ))}
    </div>
  );
};
