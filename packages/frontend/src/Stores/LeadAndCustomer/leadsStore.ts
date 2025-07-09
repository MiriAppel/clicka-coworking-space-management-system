import { Lead, LeadInteraction } from "shared-types";
import { UUIDTypes } from "uuid";
import { create } from "zustand";

interface LeadsState {
    leads: Lead[];
    isEditModalOpen: boolean,
    editingInteraction: LeadInteraction | null,
    selectedLead: Lead | null;
    loading: boolean;
    error?: string;
    showGraphForId: string | null;

    fetchLeads: () => Promise<void>;
    handleSelectLead: (leadId: string | null) => void;
    handleDeleteLead: (leadId: string) => Promise<void>;
    handleCreateLead: (lead: Lead) => Promise<Lead>;
    handleCreateInteraction: (lead: Lead) => Promise<Response>;
    handleUpdateLead: (leadId: string, lead: Lead) => Promise<Lead>;
    resetSelectedLead: () => void;
    fetchLeadDetails: (leadId: string) => Promise<Lead>;
    setShowGraphForId: (id: string | null) => void;
    setIsEditModalOpen: (flag: boolean) => void;
    setEditingInteraction: (interaction: LeadInteraction | null) => void;

}

export const useLeadsStore = create<LeadsState>((set) => ({
    leads: [],
    selectedLead: null,
    loading: false,
    error: undefined,
    showGraphForId: null,
    isEditModalOpen: false,
    editingInteraction: null,
    fetchLeads: async () => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch("http://localhost:3001/api/leads"); // כאן אתה משנה לכתובת שלך
            if (!response.ok) {
                throw new Error("Failed to fetch leads");
            }
            const data: Lead[] = await response.json();
            set({ leads: data, loading: false });

        } catch (error: any) {
            set({ error: error.message || "שגיאה בטעינת הלידים", loading: false });
        }
    },

    handleSelectLead: (leadId: UUIDTypes | null) => {
        if (leadId === null) {
            set({ selectedLead: null, isEditModalOpen: false, editingInteraction: null });
            return;
        }
        set((state) => ({
            selectedLead: state.leads.find(lead => lead.id === leadId),
            isEditModalOpen: false,
            editingInteraction: null
        }));
    },

    handleDeleteLead: async (leadId: UUIDTypes) => {
        // Delete lead logic here
    },

    handleCreateLead: async (lead: Lead) => {
        // Create lead logic here
        return lead; // Return the created lead
    },

    handleUpdateLead: async (leadId: UUIDTypes, lead: Lead) => {
        // Update lead logic here
        return lead; // Return the updated lead
    },

    resetSelectedLead: () => {
        set({ selectedLead: null, isEditModalOpen: false, editingInteraction: null });
    },

    fetchLeadDetails: async (leadId: string) => {
        // Fetch lead details logic here
        return {} as Lead; // Return the fetched lead details
    },
    setShowGraphForId: (id: string | null) => {
        set({ showGraphForId: id });
    },
    setIsEditModalOpen(flag: boolean) {
        set({ isEditModalOpen: flag })
    },
    setEditingInteraction: async (interaction: LeadInteraction | null) => {
        set({ editingInteraction: interaction })
    },
    handleCreateInteraction: async (lead: Lead) => {
        try {
            console.log(lead);
            const response = await fetch(`http://localhost:3001/api/leads/${lead.id}/addInteraction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(lead.interactions[lead.interactions.length - 1]),
            });
            if (!response.ok) {
                console.log('***********************************');

            }
            console.log('-----------------------------');

            return await response;
        } catch (error) {
            console.error("Error adding interaction:", error);
            console.log('111111111111111111111111111');

            throw error;
        }
        
    },
}
));