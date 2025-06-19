import { DateISO, ID } from "../../../../types/core";

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