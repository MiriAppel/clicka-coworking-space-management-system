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

interface Room {
  id: string | number;
  name: string;
  description?: string;
  type: string;
  capacity: number;
  status: string;
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
  rooms: Room[];
  loading: boolean;
  error: string | null;
  selectedAssignment: Assignment | null;

  // Actions
  getAllSpaces: () => Promise<Space[]>;
  getAllCustomers: () => Promise<Customer[]>;
  getAllRooms: () => Promise<Room[]>;
  getSpaceById: (id: string | number) => Promise<Space>;
  createSpace: (spaceData: Omit<Space, 'id'>) => Promise<Space>;
  updateSpace: (id: string | number, spaceData: Partial<Space>) => Promise<Space>;
  deleteSpace: (id: string | number) => Promise<void>;
  createAssignment: (assignmentData: Omit<Assignment, 'id'>) => Promise<Assignment>;
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
  rooms: [],
  loading: false,
  error: null,
  selectedAssignment: null,

  /**
   * מביא את כל הלקוחות מהשרת
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
   * מביא את כל החדרים מהשרת
   */
  getAllRooms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Room[]>('/api/rooms/getAllRooms');
      set({ rooms: response.data, loading: false });
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
   * מביא את כל חללי העבודה מהשרת
   * מעדכן את state.spaces עם הנתונים שהתקבלו
   * מנהל loading state ושגיאות
   * @returns Promise<Space[]> - מערך של כל חללי העבודה
   */
  getAllSpaces: async () => {
    set({ loading: true, error: null });
    try {
      // תיקון הנתיב להתאים ל-Backend routes
      const response = await api.get<Space[]>('/api/space/getAllSpaces');
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
   * מביא חלל עבודה ספציפי לפי ID
   * לא מעדכן את ה-state, רק מחזיר את הנתונים
   * @param id - מזהה חלל העבודה
   * @returns Promise<Space> - פרטי חלל העבודה
   */
  getSpaceById: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      // תיקון הנתיב להתאים ל-Backend routes
      const response = await api.get<Space>(`/api/space/getSpaceById/${id}`);
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
   * יוצר חלל עבודה חדש בשרת
   * מוסיף את החלל החדש למערך spaces ב-state
   * @param spaceData - נתוני חלל העבודה החדש (ללא ID)
   * @returns Promise<Space> - חלל העבודה שנוצר (כולל ID)
   */
  createSpace: async (spaceData: Omit<Space, 'id'>) => {
    set({ loading: true, error: null });
    try {
      // תיקון הנתיב להתאים ל-Backend routes
      const response = await api.post<Space>('/api/space/createSpace', spaceData);
      const newSpace = response.data;
      set((state) => ({
        spaces: [...state.spaces, newSpace],
        loading: false
      }));
      return newSpace;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * מעדכן חלל עבודה קיים בשרת
   * מעדכן את החלל המתאים במערך spaces ב-state
   * @param id - מזהה חלל העבודה לעדכון
   * @param spaceData - נתונים חלקיים לעדכון
   * @returns Promise<Space> - חלל העבודה המעודכן
   */
  updateSpace: async (id: string | number, spaceData: Partial<Space>) => {
    set({ loading: true, error: null });
    try {
      // תיקון הנתיב להתאים ל-Backend routes
      const response = await api.put<Space>(`/api/space/updateSpace/${id}`, spaceData);
      const updatedSpace = response.data;
      set((state) => ({
        spaces: state.spaces.map((space) => 
          space.id === id ? updatedSpace : space
        ),
        loading: false
      }));
      return updatedSpace;
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.message 
        : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * מוחק חלל עבודה מהשרת
   * מסיר את החלל ממערך spaces ב-state
   * @param id - מזהה חלל העבודה למחיקה
   * @returns Promise<void>
   */
  deleteSpace: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      // תיקון הנתיב להתאים ל-Backend routes
      await api.delete(`/api/space/deleteSpace/${id}`);
      set((state) => ({
        spaces: state.spaces.filter((space) => space.id !== id),
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
   * יוצר הקצאה חדשה (assignment) בשרת
   * מוסיף את ההקצאה החדשה למערך assignments ב-state
   * @param assignmentData - נתוני ההקצאה החדשה (ללא ID)
   * @returns Promise<Assignment> - ההקצאה שנוצרה (כולל ID)
   */
  createAssignment: async (assignmentData: Omit<Assignment, 'id'>) => {
    set({ loading: true, error: null });
    try {
      // הערה: אין endpoint ל-assignments ב-routes שלך, אולי צריך להוסיף
      const response = await api.post<Assignment>('/api/space/createAssignment', assignmentData);
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
   * מגדיר הקצאה נבחרת ב-state
   * שימושי לעריכה או הצגת פרטים
   * @param assignment - ההקצאה לבחירה או null לביטול בחירה
   */
  setSelectedAssignment: (assignment: Assignment | null) => {
    set({ selectedAssignment: assignment });
  },

  /**
   * מנקה שגיאות מה-state
   * שימושי לאיפוס הודעות שגיאה לאחר טיפול בהן
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * מאפס את כל ה-state לערכי ברירת המחדל
   * שימושי לניקוי נתונים בעת logout או reset כללי
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
