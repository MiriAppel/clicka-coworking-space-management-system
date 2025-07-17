import { Lead } from "shared-types";
import { UUIDTypes } from "uuid";
import { create } from "zustand";

interface LeadsState {
    leads: Lead[];
    selectedLead: Lead | null;
    loading: boolean;
    error?: string;
    showGraphForId: string | null;

    fetchLeads: () => Promise<void>;
    handleSelectLead: (leadId: string | null) => void;
    handleDeleteLead: (leadId: string) => Promise<void>;
    handleCreateLead: (lead: Lead) => Promise<Lead>;
    handleUpdateLead: (leadId: string, lead: Partial<Lead>) => Promise<Lead>;
    resetSelectedLead: () => void;
    fetchLeadDetails: (leadId: string) => Promise<Lead>;
    setShowGraphForId: (id: string | null) => void;

}

const BASE_API_URL = `${process.env.REACT_APP_API_URL}/leads`;


export const useLeadsStore = create<LeadsState>((set) => ({
    leads: [],
    selectedLead: null,
    loading: false,
    error: undefined,
    showGraphForId: null,
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
            set({ selectedLead: null });
            return;
        }
        set((state) => ({
            selectedLead: state.leads.find(lead => lead.id === leadId)
        }));
    },

    handleDeleteLead: async (leadId: UUIDTypes) => {
        // Delete lead logic here
    },

    handleCreateLead: async (lead: Lead) => {
        // Create lead logic here
        return lead; // Return the created lead
    },

    handleUpdateLead: async (leadId: UUIDTypes, lead: Partial<Lead>): Promise<Lead> => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`${BASE_API_URL}/${leadId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lead),
            });
            if (!response.ok) {
                let errorMsg = "Failed to update customer";
                try {
                    const errorBody = await response.json();
                    errorMsg = errorBody?.error?.details || errorBody?.error?.message || errorBody?.message || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
            const updatedLead: Lead = await response.json();
            await useLeadsStore.getState().fetchLeads();
            return updatedLead;
        } catch (error: any) {
            set({ error: error.message || "שגיאה בעדכון מתעניין", loading: false });
            throw error; // חשוב לזרוק את השגיאה כדי שההבטחה תיכשל ולא תחזור undefined
        } finally {
            set({ loading: false });
        }
    },

    resetSelectedLead: () => {
        set({ selectedLead: null });


    },

    fetchLeadDetails: async (leadId: string) => {
        // Fetch lead details logic here
        return {} as Lead; // Return the fetched lead details
    },
    setShowGraphForId: (id: string | null) => {
        set({ showGraphForId: id });
    }
}));