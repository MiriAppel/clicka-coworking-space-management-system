import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

// הגדרת בסיס URL לAPI
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// הגדרת טיפוסים
interface Space {
  id: string | number;
  name: string;
  description?: string;
  capacity?: number;
  location?: string;
}

interface Customer {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
}

interface Assignment {
  id: string | number;
  workspaceId: string | number;
  customerId: string | number;
  assignedDate: string;
  unassignedDate?: string;
  notes?: string;
  assignedBy: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ENDED';
}

interface AssignmentStoreState {
  // State
  assignments: Assignment[];
  spaces: Space[];
  customers: Customer[];
  loading: boolean;
  error: string | null;
  selectedAssignment: Assignment | null;

  // Actions
  getAllSpaces: () => Promise<Space[]>;
  getAllCustomers: () => Promise<Customer[]>;
  createAssignment: (assignmentData: Omit<Assignment, 'id'>) => Promise<Assignment>;
  getAssignments: () => Promise<Assignment[]>;
  getAssignmentById: (id: string | number) => Promise<Assignment>;
  updateAssignment: (id: string | number, assignmentData: Partial<Assignment>) => Promise<Assignment>;
  deleteAssignment: (id: string | number) => Promise<void>;
  setSelectedAssignment: (assignment: Assignment | null) => void;
  clearError: () => void;
  resetStore: () => void;
}

// יצירת instance של axios עם הגדרות בסיסיות
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAssignmentStore = create<AssignmentStoreState>((set, get) => ({
  // State - מצב התחלתי של הסטור
  assignments: [],
  spaces: [],
  customers: [],
  loading: false,
  error: null,
  selectedAssignment: null,

  /**
   * מביא את כל הלקוחות מהשרת - לצורך הצגה בטופס
   */
  getAllCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Customer[]>('/api/customers');
      set({ customers: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * מביא את כל חללי העבודה מהשרת - לצורך הצגה בטופס
   */
  getAllSpaces: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Space[]>('/api/workspace/getAllWorkspace');
      set({ spaces: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * יוצר הקצאה חדשה - משתמש ב-createSpace (שבעצם יוצר הקצאה)
   */
  createAssignment: async (assignmentData: Omit<Assignment, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<Assignment>('/api/space/createSpace', assignmentData);
      const newAssignment = response.data;
      set((state) => ({
        assignments: [...state.assignments, newAssignment],
        loading: false
      }));
      return newAssignment;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },


  /**
   * מביא את כל ההקצאות - משתמש ב-getAllSpaces (שבעצם מביא הקצאות)
   */
  getAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Assignment[]>('/api/space/getAllSpaces');
      set({ assignments: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * מביא הקצאה ספציפית לפי ID - משתמש ב-getSpaceById
   */
  getAssignmentById: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Assignment>(`/api/space/getSpaceById/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * מעדכן הקצאה קיימת - משתמש ב-updateSpace
   */
  updateAssignment: async (id: string | number, assignmentData: Partial<Assignment>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<Assignment>(`/api/space/updateSpace/${id}`, assignmentData);
      const updatedAssignment = response.data;
      set((state) => ({
        assignments: state.assignments.map((assignment) => 
          assignment.id === id ? updatedAssignment : assignment
        ),
        loading: false
      }));
      return updatedAssignment;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * מוחק הקצאה - משתמש ב-deleteSpace
   */
  deleteAssignment: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/space/deleteSpace/${id}`);
      set((state) => ({
        assignments: state.assignments.filter((assignment) => assignment.id !== id),
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * מגדיר הקצאה נבחרת ב-state
   */
  setSelectedAssignment: (assignment: Assignment | null) => {
    set({ selectedAssignment: assignment });
  },

  /**
   * מנקה שגיאות מה-state
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * מאפס את כל ה-state לערכי ברירת המחדל
   */
  resetStore: () => {
    set({
      assignments: [],
      spaces: [],
      customers: [],
      loading: false,
      error: null,
      selectedAssignment: null,
    });
  },
}));
