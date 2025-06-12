export class Room {
   MinimumBookingMiniuts:number;
   MaximumBookingMiniuts:number;
   AdvanceBookingDays:number;
   RequiredApproval:boolean;
   FreeHoursForKlikcaCard:number;
  
    constructor(
        MinimumBookingMiniuts:number,MaximumBookingMiniuts:number,AdvanceBookingDays:number,RequiredApproval:boolean,FreeHoursForKlikcaCard:number
    ) {
     this.MinimumBookingMiniuts=MinimumBookingMiniuts;
     this.MaximumBookingMiniuts=MaximumBookingMiniuts;
     this.AdvanceBookingDays=AdvanceBookingDays;
     this.RequiredApproval=RequiredApproval;
     this.FreeHoursForKlikcaCard=FreeHoursForKlikcaCard;
    }
  
    toDatabaseFormat() {
      return {
        MinimumBookingMiniuts:this.MinimumBookingMiniuts,
        MaximumBookingMiniuts:this.MaximumBookingMiniuts,
        AdvanceBookingDays:this.AdvanceBookingDays,
        RequiredApproval:this.RequiredApproval,
        FreeHoursForKlikcaCard:this.FreeHoursForKlikcaCard
      };
    }
  }
  