import { ID } from "../../../shared-types/core";
import { Room,RoomFeature } from "../../../shared-types/booking";

export class RoomFeatureModel implements RoomFeature {
  id: ID;
  description?: string;
  IsIncluded: boolean;
  additionalCost: number;

  constructor(
    id: ID,
    IsIncluded: boolean,
    additionalCost: number,
    description?: string
  ) {
    this.id = id;
    this.IsIncluded = IsIncluded;
    this.additionalCost = additionalCost;
    this.description = description;
  }

  toDatabaseFormat() {
    return {
      description: this.description,
      IsIncluded: this.IsIncluded,
      additionalCost: this.additionalCost
    };
  }
}