import { ID } from "../../../shared-types/core";
import { Room,RoomFeature } from "../../../../types/booking";

export class RoomFeatureModel implements RoomFeature {
  description?: string;
  IsIncluded: boolean;
  additionalCost: number;

  constructor(
    IsIncluded: boolean,
    additionalCost: number,
    description?: string
  ) {
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

