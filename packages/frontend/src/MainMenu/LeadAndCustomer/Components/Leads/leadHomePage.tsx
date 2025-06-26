import { useEffect, useState } from "react";
import { LeadDetails } from "./leadDetails";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { Lead } from "shared-types";

export const LeadHomePage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    leads,
    fetchLeads,
    handleDeleteLead,
  } = useLeadsStore();

  useEffect(() => {
    fetchLeads();
    console.log("Leads fetched:", leads);

  }, [fetchLeads]);

  const deleteLead = (id: string) => {
    handleDeleteLead(id);
    if (selectedId === id) setSelectedId(null);
  };

  const hasRecentInteraction = (lead: Lead, days: number = 30): boolean => {
    const now = new Date();
    const recentThreshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return lead.interactions?.some((interaction) => {
      const interactionDate = new Date(interaction.updatedAt || interaction.createdAt);
      return interactionDate >= recentThreshold;
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">מתעניינים</h2>
      {leads.map(lead => (
        <div
          key={lead.id}
          className={`border rounded-lg p-4 mb-2 cursor-pointer transition
    ${selectedId === lead.id
              ? "bg-blue-100 border-blue-300"
              : hasRecentInteraction(lead)
                ? "hover:bg-gray-50"
                : "border-red-500 bg-red-50"
            }`}
          onClick={() => setSelectedId(selectedId === lead.id ? null : lead.id)}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg">{lead.name}</div>
              <div className="text-sm text-gray-600">סטטוס: {lead.status}</div>
            </div>
          </div>
          {selectedId === lead.id && (
            <LeadDetails lead={lead} onDelete={() => deleteLead(lead.id)} />
          )}
        </div>
      ))}
    </div>
  );
};