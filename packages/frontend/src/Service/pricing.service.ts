// pricing.service.ts
import axios from 'axios';
import {
  UpdateLoungePricingRequest,
  LoungePricing,
  PricingTier,
  PricingTierCreateRequest,
  MeetingRoomPricing,
  UpdateMeetingRoomPricingRequest,
  UpdatePricingTierRequest,
  
} from 'shared-types';

const API_BASE_URL = '/api/pricing';

// פונקציית עזר לחילוץ הודעת שגיאה
function extractErrorMessage(error: any): string {
 /* if (axios.isAxiosError(error) && error.response) {
    // ננסה לחלץ את הודעת השגיאה מהתגובה של השרת
    const responseData = error.response.data;
    console.log('Axios Error Response Data:', responseData); // הדפסה לבדיקה

    if (typeof responseData === 'string') {
      return responseData; // אם התגובה היא מחרוזת ישירות
    }
    if (responseData && typeof responseData === 'object') {
      // ננסה שדות נפוצים
      if (responseData.message) return responseData.message;
      if (responseData.error) return responseData.error;
      if (responseData.description) return responseData.description;
      // אם יש שדה errors (לדוגמה, מולידציה)
      if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        return responseData.errors.map((e: any) => e.message || e.msg || e).join(', ');
      }
    }
    // אם לא מצאנו שדה ספציפי, נחזיר הודעה כללית עם סטטוס
    return `שגיאה מהשרת (קוד: ${error.response.status || 'לא ידוע'})`;
  }
  // אם זו לא שגיאת Axios או שאין תגובה מהשרת
  console.log('General Error Object:', error); // הדפסה לבדיקה
  return error.message || 'שגיאה בלתי צפויה.';
  */
 return "";
}


// --- Lounge Pricing ---
export async function getCurrentLoungePricing(): Promise<LoungePricing | null> {
  try {
    const response = await axios.get<LoungePricing>(`${API_BASE_URL}/lounge/current`);
    return response.data ?? null;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function createLoungePricingWithHistory(
  data: UpdateLoungePricingRequest
): Promise<LoungePricing> {
  try {
    const response = await axios.post<LoungePricing>(`${API_BASE_URL}/lounge`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateLoungePricing(id: string, data: UpdateLoungePricingRequest): Promise<LoungePricing> {
  try {
    const response = await axios.put<LoungePricing>(`${API_BASE_URL}/lounge/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function deleteLoungePricing(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/lounge/${id}`);
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getAllLoungePricingHistory(): Promise<LoungePricing[]> {
  try {
    const response = await axios.get<LoungePricing[]>(`${API_BASE_URL}/lounge/history`);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

// --- Workspace Pricing ---
export async function getCurrentPricingTier(workspaceType: string): Promise<PricingTier | null> {
  try {
    const response = await axios.get<PricingTier>(`${API_BASE_URL}/tier/current`, { params: { workspaceType } });
    return response.data ?? null;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}
export async function createPricingTierWithHistory(data: UpdatePricingTierRequest): Promise<PricingTier> {
  try {
    const response = await axios.post<PricingTier>(`${API_BASE_URL}/tier`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}


export async function createOrUpdatePricingTier(data: PricingTierCreateRequest): Promise<PricingTier> {
  try {
    const response = await axios.post<PricingTier>(`${API_BASE_URL}/tier`, data);
    return response.data;
  } catch (error: any) {
    // זו הפונקציה הספציפית שמעלה את השגיאה "תאריך התחולה מתנגש..."
    throw new Error(extractErrorMessage(error));
  }
}
export async function updatePricingTierPricing(id: string, data: UpdatePricingTierRequest): Promise<PricingTier> {
  try {
    const response = await axios.put<PricingTier>(`${API_BASE_URL}/tier/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}


// --- Meeting Room Pricing ---
export async function getCurrentMeetingRoomPricing(): Promise<MeetingRoomPricing | null> {
  try {
    const response = await axios.get<MeetingRoomPricing>(`${API_BASE_URL}/meeting-room/current`);
    return response.data ?? null;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function createMeetingRoomPricingWithHistory(data: UpdateMeetingRoomPricingRequest): Promise<MeetingRoomPricing> {
  try {
    const response = await axios.post<MeetingRoomPricing>(`${API_BASE_URL}/meeting-room`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateMeetingRoomPricing(id: string, data: UpdateMeetingRoomPricingRequest): Promise<MeetingRoomPricing> {
  try {
    const response = await axios.put<MeetingRoomPricing>(`${API_BASE_URL}/meeting-room/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function deleteMeetingRoomPricing(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/meeting-room/${id}`);
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getAllMeetingRoomPricingHistory(): Promise<MeetingRoomPricing[]> {
  try {
    const response = await axios.get<MeetingRoomPricing[]>(`${API_BASE_URL}/meeting-room/history`);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}