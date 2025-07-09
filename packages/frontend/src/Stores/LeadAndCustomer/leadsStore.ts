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
    handleUpdateLead: (leadId: string, lead: Lead) => Promise<Lead>;
    resetSelectedLead: () => void;
    fetchLeadDetails: (leadId: string) => Promise<Lead>;
    setShowGraphForId: (id: string | null) => void;
    handleDeleteInteraction: (interactionId: string) => Promise<void>; // הוספת המאפיין החדש


}

export const useLeadsStore = create<LeadsState>((set, get) => ({
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
        if(leadId === null) {
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

    handleUpdateLead: async (leadId: UUIDTypes, lead: Lead) => {
        // Update lead logic here
        return lead; // Return the updated lead
    },

    resetSelectedLead: () => {
        set({ selectedLead: null });
        
        
    },

    fetchLeadDetails: async (leadId: string) => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`http://localhost:3001/api/leads/${leadId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch lead details");
            }
            const data: Lead = await response.json();
            set({ selectedLead: data, loading: false });
            return data;
        } catch (error: any) {
            set({ error: error.message || "שגיאה בטעינת פרטי הליד", loading: false });
            return {} as Lead;
        }
    },
    setShowGraphForId: (id: string | null) => {
        set({ showGraphForId: id });
    },

// handleDeleteInteraction: async (interactionId: string) => {
//     const selectedLead = get().selectedLead;
//     if (!selectedLead) {
//         console.error("No selected lead to delete interaction from");
//         return;
//     }
//     try {
//         const response = await fetch(`http://localhost:3001/api/leads/${selectedLead.id}/interactions/${interactionId}`, {
//             method: "DELETE",
//         });
//         if (!response.ok) {
//             throw new Error("Failed to delete interaction");
//         }
//         // אין עדכון סטייט ידני! רק קריאה לשרת
//         console.log("Interaction deleted successfully");
//     } catch (error: any) {
//         console.error("Error deleting interaction:", error);
//     }
// }
handleDeleteInteraction: async (interactionId: string) => {
    const { selectedLead } = get();
    if (!selectedLead) {
        console.error("No selected lead to delete interaction from");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3001/api/leads/${selectedLead.id}/interactions/${interactionId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete interaction");
        }

        // מעדכן את selectedLead בסטייט כך שיכיל את רשימת האינטראקציות לאחר מחיקה
        const updatedInteractions = selectedLead.interactions.filter(
            (interaction) => interaction.id !== interactionId
        );

        set({
            selectedLead: {
                ...selectedLead,
                interactions: updatedInteractions
            }
        });

        console.log("Interaction deleted successfully");
    } catch (error: any) {
        console.error("Error deleting interaction:", error);
    }
}

}));
