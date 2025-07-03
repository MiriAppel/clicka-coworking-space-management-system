import { useEffect, useState } from "react";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { Lead } from "shared-types";
import { LeadInteractionDetails } from "./leadInteractionDetails";

type SortField = "name" | "status" | "createdAt" | "updatedAt" | "lastInteraction";
type AlertCriterion = "noRecentInteraction" | "statusIsNew" | "oldLead";

export const LeadInteractions = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(false); // כאן נוספה השליטה בגרף
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [alertCriterion, setAlertCriterion] = useState<AlertCriterion>("noRecentInteraction");

  const {
    leads,
    selectedLead,
    fetchLeads,
    handleDeleteLead,
    handleSelectLead
  } = useLeadsStore();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const deleteLead = (id: string) => {
    handleDeleteLead(id);
    if (selectedId === id) setSelectedId(null);
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
      case "name": return lead.name?.toLowerCase() || "";
      case "status": return lead.status?.toLowerCase() || "";
      case "createdAt": return new Date(lead.createdAt || 0);
      case "updatedAt": return new Date(lead.updatedAt || 0);
      case "lastInteraction":
        const dates = lead.interactions?.map(i => new Date(i.updatedAt || i.createdAt)) || [];
        return dates.length > 0 ? Math.max(...dates.map(d => d.getTime())) : 0;
      default: return "";
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

      {/* תפריטים - השארתי בלי שינוי */}

      {sortedLeads.map((lead) => (
        <div
          key={lead.id}
          className={`border rounded-lg p-4 mb-2 cursor-pointer transition ${
            selectedId === lead.id
              ? "bg-blue-100 border-blue-300"
              : isAlert(lead)
                ? "border-red-500 bg-red-50"
                : "hover:bg-gray-50"
          }`}
          onClick={() => {
            if (selectedId === lead.id) {
              setShowGraph((prev) => !prev); // החלף בין גרף לפרטים
            } else {
              setSelectedId(lead.id!); // בחר ליד חדש
              setShowGraph(false);    // תמיד מתחיל בפרטים
            }
            handleSelectLead(lead.id!);
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg">{lead.name}</div>
              <div className="text-sm text-gray-600">סטטוס: {lead.status}</div>
            </div>
          </div>

          {selectedLead && selectedId === lead.id && (
            <LeadInteractionDetails/>
          )}
        </div>
      ))}
    </div>
  );
}