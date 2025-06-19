import { DateISO, ID } from "../../../../types/core";
import {WorkspaceType} from '../../../../types/customer'
import {DateRangeFilter} from '../../../../types/core'
export interface AvailabilityQuery {
  workspaceTypes?: WorkspaceType[];
  startDate: DateISO;
  endDate?: DateISO;
  includeMaintenanceSchedule?: boolean;
  includeReservedSpaces?: boolean;
 }
 export interface AvailabilityResult {
  query: AvailabilityQuery;
  availability: {
    [key in WorkspaceType]: {
      total: number;
      available: number;
      availabilityRate: number;
      availableSpaces: AvailableSpace[];
    };
  };
}
export interface AvailabilityForecast {
  forecastPeriod: DateRangeFilter;
  projections: {
    date: DateISO;
    expectedOccupancy: number;
    availableCapacity: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
}
// מחלקה למקום זמין
export class AvailableSpace {
  workspaceId: ID;
  name: string;
  features: string[];
  availableFrom: DateISO;
  availableUntil?: DateISO;
  restrictions?: string[];

  constructor(params: {
    workspaceId: ID;
    name: string;
    features: string[];
    availableFrom: DateISO;
    availableUntil?: DateISO;
    restrictions?: string[];
  }) {
    this.workspaceId = params.workspaceId;
    this.name = params.name;
    this.features = params.features;
    this.availableFrom = params.availableFrom;
    this.availableUntil = params.availableUntil;
    this.restrictions = params.restrictions;
  }

  toDatabaseFormat() {
    return {
      workspaceId: this.workspaceId,
      name: this.name,
      features: this.features,
      availableFrom: this.availableFrom,
      availableUntil: this.availableUntil,
      restrictions: this.restrictions,
    };
  }
}