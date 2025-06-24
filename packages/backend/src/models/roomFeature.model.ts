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
  }
  