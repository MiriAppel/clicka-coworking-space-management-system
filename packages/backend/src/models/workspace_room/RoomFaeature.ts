export class Room {
    name: string;
    description?: string;
    IsIncluded:boolean;
    additionalCost:number;
    
    constructor(
      name: string,
      description: string,
      IsIncluded: boolean,
      additionalCost: number,
    ) {
      this.name = name;
      this.description = description;
     this.IsIncluded=IsIncluded;
     this.additionalCost=additionalCost;
    }
  
    toDatabaseFormat() {
      return {
        name: this.name,
        description: this.description,
        IsIncluded:this.IsIncluded,
        additionalCost:this.additionalCost
      };
    }
  }
  