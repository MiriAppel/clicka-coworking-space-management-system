
import {LoungePricing, MeetingRoomPricing, PricingTier} from '../../../../types/pricing'
import { ID , DateISO } from '../../../../types/core';
import { WorkspaceType } from '../../../../types/customer';
export class LoungePricingModel implements LoungePricing{
    id: ID;
    eveningRate: number;
    memberDiscountRate: number;
    active: boolean;
    effectiveDate: DateISO;
    createdAt: DateISO;
    updatedAt: DateISO;
    constructor(
        id: ID,
        eveningRate: number,
        memberDiscountRate: number,
        active: boolean,
        effectiveDate: DateISO,
        createdAt: DateISO,
        updatedAt: DateISO
    ){
        this.id=id;
        this.eveningRate=eveningRate;
        this.memberDiscountRate=memberDiscountRate;
        this.active=active;
        this.effectiveDate=effectiveDate;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }
    toDatabaseFormat(){
        return{
        id:this.id,
        eveningRate:this.eveningRate,
        memberDiscountRate:this.memberDiscountRate,
        active:this.active,
        effectiveDate:this.effectiveDate,
        createdAt:this.createdAt,
        updatedAt:this.updatedAt
        }
    }
}
export class MeetingRoomPricingModel implements MeetingRoomPricing{
    id: ID;
    hourlyRate: number;
    discountedHourlyRate: number;
    freeHoursKlikahCard: number;
    active: boolean;
    effectiveDate: DateISO;
    createdAt: DateISO;
    updatedAt: DateISO;
    constructor(
        id: ID,
        hourlyRate: number,
        discountedHourlyRate: number,
        freeHoursKlikahCard: number,
        active: boolean,
        effectiveDate: DateISO,
        createdAt: DateISO,
        updatedAt: DateISO
    ){
        this.id=id;
        this.hourlyRate=hourlyRate;
        this.discountedHourlyRate=discountedHourlyRate;
        this.freeHoursKlikahCard=freeHoursKlikahCard;
        this.active=active;
        this.effectiveDate=effectiveDate;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }
    toDatabaseFormat(){
        return {
            id:this.id,
            hourlyRate:this.hourlyRate,
            discountedHourlyRate:this.discountedHourlyRate,
            freeHoursKlikahCard:this.freeHoursKlikahCard,
            active:this.active,
            effectiveDate:this.effectiveDate,
            createdAt:this.createdAt,
            updatedAt:this.updatedAt
        }
    }
    
}
export class PricingTierModel implements PricingTier{
    id: ID;
    workspaceType: WorkspaceType;
    year1Price: number;
    year2Price: number;
    year3Price: number;
    year4Price: number;
    active: boolean;
    effectiveDate: string;
    createdAt: string;
    updatedAt: string;
    constructor(
    id: ID,
    workspaceType: WorkspaceType,
    year1Price: number,
    year2Price: number,
    year3Price: number,
    year4Price: number,
    active: boolean,
    effectiveDate: DateISO,
    createdAt: DateISO,
    updatedAt: DateISO
    ){
        this.id=id;
        this.workspaceType=workspaceType;
        this.year1Price=year1Price;
        this.year2Price=year2Price;
        this.year3Price=year3Price;
        this.year4Price=year4Price;
        this.active=active;
        this.effectiveDate=effectiveDate;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }
    toDatabaseFormat(){
        return {
            id:this.id,
            workspaceType:this.workspaceType,
            year1Price:this.year1Price,
            year2Price:this.year2Price,
            year3Price: this.year3Price,
            year4Price:this.year4Price,
            active:this.active,
            effectiveDate:this.effectiveDate,
            createdAt:this.createdAt,
            updatedAt:this.updatedAt
        };
    }
}