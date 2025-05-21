// pricing-types.d.ts

import { ApiResponse, ID } from './core-types';
import { WorkspaceType } from './customer-types';

// Pricing tier
export interface PricingTier {
  id: ID;
  workspaceType: WorkspaceType;
  year1Price: number;
  year2Price: number;
  year3Price: number;
  year4Price: number;
  active: boolean;
  effectiveDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// Meeting room pricing
export interface MeetingRoomPricing {
  id: ID;
  hourlyRate: number;
  discountedHourlyRate: number; // For 4+ hours
  freeHoursKlikahCard: number; // Free hours for Klikah Card holders
  active: boolean;
  effectiveDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// Lounge pricing
export interface LoungePricing {
  id: ID;
  eveningRate: number;
  memberDiscountRate: number; // For members
  active: boolean;
  effectiveDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// Get current pricing request
export interface GetCurrentPricingRequest {
  date?: string; // ISO date string, defaults to current date
}

// Get current pricing response
export interface GetCurrentPricingResponse {
  workspacePricing: {
    [key in WorkspaceType]: {
      year1Price: number;
      year2Price: number;
      year3Price: number;
      year4Price: number;
    };
  };
  meetingRoomPricing: {
    hourlyRate: number;
    discountedHourlyRate: number;
    freeHoursKlikahCard: number;
  };
  loungePricing: {
    eveningRate: number;
    memberDiscountRate: number;
  };
  effectiveDate: string; // ISO date string
}

// Update pricing tier request
export interface UpdatePricingTierRequest {
  workspaceType: WorkspaceType;
  year1Price: number;
  year2Price: number;
  year3Price: number;
  year4Price: number;
  effectiveDate: string; // ISO date string
}

// Update meeting room pricing request
export interface UpdateMeetingRoomPricingRequest {
  hourlyRate: number;
  discountedHourlyRate: number;
  freeHoursKlikahCard: number;
  effectiveDate: string; // ISO date string
}

// Update lounge pricing request
export interface UpdateLoungePricingRequest {
  eveningRate: number;
  memberDiscountRate: number;
  effectiveDate: string; // ISO date string
}

// Get pricing history request
export interface GetPricingHistoryRequest {
  workspaceType?: WorkspaceType;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

// Get pricing history response
export interface GetPricingHistoryResponse {
  pricingHistory: {
    effectiveDate: string;
    pricingData: {
      workspaceType: WorkspaceType;
      year1Price: number;
      year2Price: number;
      year3Price: number;
      year4Price: number;
    }[];
    meetingRoomPricing?: {
      hourlyRate: number;
      discountedHourlyRate: number;
      freeHoursKlikahCard: number;
    };
    loungePricing?: {
      eveningRate: number;
      memberDiscountRate: number;
    };
  }[];
}
