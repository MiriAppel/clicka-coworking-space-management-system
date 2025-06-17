import { DateISO, DateRangeFilter } from "../../types/core";

// מחלקה לחיזוי זמינות
export class AvailabilityForecast {
  forecastPeriod: DateRangeFilter;
  projections: {
    date: DateISO;
    expectedOccupancy: number;
    availableCapacity: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
  recommendations: string[];

  constructor(params: {
    forecastPeriod: DateRangeFilter;
    projections: {
      date: DateISO;
      expectedOccupancy: number;
      availableCapacity: number;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
    recommendations: string[];
  }) {
    this.forecastPeriod = params.forecastPeriod;
    this.projections = params.projections;
    this.recommendations = params.recommendations;
  }

  toDatabaseFormat() {
    return {
      forecastPeriod: this.forecastPeriod,
      projections: this.projections,
      recommendations: this.recommendations,
    };
  }
}