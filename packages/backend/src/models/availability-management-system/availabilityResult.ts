import { DateISO } from "../../types/core";
import { WorkspaceType } from "../../types/customer";
import { AvailabilityQuery,  } from "./availabilityQuery";
import { AvailableSpace } from "./availableSpace";

// מחלקה לתוצאות זמינות
export class AvailabilityResult {
  query: AvailabilityQuery;
  availability: {
    [key in WorkspaceType]: {
      total: number;
      available: number;
      availabilityRate: number;
      availableSpaces: AvailableSpace[];
    };
  };
  nextAvailabilityDate?: DateISO;
  recommendedAlternatives?: WorkspaceType[];

  constructor(params: {
    query: AvailabilityQuery;
    availability: {
      [key in WorkspaceType]: {
        total: number;
        available: number;
        availabilityRate: number;
        availableSpaces: AvailableSpace[];
      };
    };
    nextAvailabilityDate?: DateISO;
    recommendedAlternatives?: WorkspaceType[];
  }) {
    this.query = params.query;
    this.availability = params.availability;
    this.nextAvailabilityDate = params.nextAvailabilityDate;
    this.recommendedAlternatives = params.recommendedAlternatives;
  }

  toDatabaseFormat() {
    return {
      query: this.query.toDatabaseFormat(),
      availability: this.availability,
      nextAvailabilityDate: this.nextAvailabilityDate,
      recommendedAlternatives: this.recommendedAlternatives,
    };
  }
}