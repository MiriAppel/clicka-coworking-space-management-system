import { Lead, LeadInteraction } from "shared-types";
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
  isEditModalOpen: boolean;
  editingInteraction: LeadInteraction | null;
  handleCreateInteraction: (lead: Lead) => Promise<Response>;
  handleDeleteInteraction: (interactionId: string) => Promise<void>; // הוספת המאפיין החדש
  setIsEditModalOpen: (flag: boolean) => void;
  setEditingInteraction: (interaction: LeadInteraction | null) => void;

}

const BASE_API_URL = `${process.env.REACT_APP_API_URL}/leads`;


export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  selectedLead: null,
  loading: false,
  error: undefined,
  showGraphForId: null,
  isEditModalOpen: false,
  editingInteraction: null,
  setLeads: (newLeads: any) => set({ leads: newLeads }),
  fetchLeads: async () => {
    set({ loading: true, error: undefined });
    try {
      const response = await fetch(BASE_API_URL); // כאן אתה משנה לכתובת שלך
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
      set({
        selectedLead: null,
        isEditModalOpen: false,
        editingInteraction: null,
      });
      return;
    }
    set((state) => ({
      selectedLead: state.leads.find((lead) => lead.id === leadId),
      isEditModalOpen: false,
      editingInteraction: null,
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
    set({
      selectedLead: null,
      isEditModalOpen: false,
      editingInteraction: null,
    });
  },
  fetchLeadDetails: async (leadId: string) => {
    set({ loading: true, error: undefined });
    try {
      const response = await fetch(`${BASE_API_URL}/${leadId}`);
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
  handleDeleteInteraction: async (interactionId: string) => {
    const selectedLead = get().selectedLead;
    if (!selectedLead) {
      console.error("No selected lead to delete interaction from");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_API_URL}/${selectedLead.id}/interactions/${interactionId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete interaction");
      }
      // אין עדכון סטייט ידני! רק קריאה לשרת
      console.log("Interaction deleted successfully");
    } catch (error: any) {
      console.error("Error deleting interaction:", error);
    }
  },
  setIsEditModalOpen(flag: boolean) {
    set({ isEditModalOpen: flag });
  },
  setEditingInteraction: async (interaction: LeadInteraction | null) => {
    set({ editingInteraction: interaction });
  },
  handleCreateInteraction: async (lead: Lead) => {
    try {
      console.log(lead);
      const response = await fetch(
        `${BASE_API_URL}/${lead.id}/addInteraction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lead.interactions[lead.interactions.length - 1]),
        }
      );
      if (!response.ok) {
      }
      await get().fetchLeads();
      get().handleSelectLead(lead.id!); // החזרת הפוקוס לליד הספציפי
      return response;
    } catch (error) {
      console.error("Error adding interaction:", error);
      throw error;
    }
  },
}));
