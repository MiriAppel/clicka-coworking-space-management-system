<<<<<<< HEAD
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
=======
import type{ ID, Room } from "shared-types";

export class RoomFaeature {
    id!: ID;
    name: string;
    description?: string;
    IsIncluded:boolean;
    additionalCost:number;
      // קשר: פיצ'ר שייך לחדר אחד
  room?: Room;
    constructor(
      id:ID,
      name: string,
      description: string,
      IsIncluded: boolean,
      additionalCost: number,
    ) {
      this.id=id;
      this.name = name;
      this.description = description;
     this.IsIncluded=IsIncluded;
     this.additionalCost=additionalCost;
    }
  
    toDatabaseFormat() {
      return {
        id:this.id,
        name: this.name,
        description: this.description,
        IsIncluded:this.IsIncluded,
        additionalCost:this.additionalCost
      };
    }
>>>>>>> c87559f51ec16ab5ae4f8105ad6ad1b70185d243
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