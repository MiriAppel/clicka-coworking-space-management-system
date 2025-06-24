import { ID } from "../../../../types/core";
import { Room,RoomFeature } from "../../../../types/booking";

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
      id: this.id,
      description: this.description,
      IsIncluded: this.IsIncluded,
      additionalCost: this.additionalCost
    };
  }
}