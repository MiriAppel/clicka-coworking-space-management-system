import { Room } from "./Room";
export class BookingRules {
  roomId!: string;
   MinimumBookingMiniuts:number;
   MaximumBookingMiniuts:number;
   AdvanceBookingDays:number;
   RequiredApproval:boolean;
   FreeHoursForKlikcaCard:number;
    // קשר: כללי ההזמנה שייכים לחדר אחד
  room?: Room;

    constructor(
      roomId:string,MinimumBookingMiniuts:number,MaximumBookingMiniuts:number,AdvanceBookingDays:number,RequiredApproval:boolean,FreeHoursForKlikcaCard:number
    ) {
      this.roomId=roomId;
     this.MinimumBookingMiniuts=MinimumBookingMiniuts;
     this.MaximumBookingMiniuts=MaximumBookingMiniuts;
     this.AdvanceBookingDays=AdvanceBookingDays;
     this.RequiredApproval=RequiredApproval;
     this.FreeHoursForKlikcaCard=FreeHoursForKlikcaCard;
    }
    toDatabaseFormat() {
      return {
        roomId:this.roomId,
        MinimumBookingMiniuts:this.MinimumBookingMiniuts,
        MaximumBookingMiniuts:this.MaximumBookingMiniuts,
        AdvanceBookingDays:this.AdvanceBookingDays,
        RequiredApproval:this.RequiredApproval,
        FreeHoursForKlikcaCard:this.FreeHoursForKlikcaCard
      };
    }
  }
  