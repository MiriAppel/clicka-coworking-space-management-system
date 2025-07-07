import { DateISO, ID, LoungePricing } from "shared-types";

export class LoungePricingModel implements LoungePricing {
  id: ID;
  eveningRate: number;
  memberDiscountRate: number;
  active: boolean;
  effectiveDate: DateISO;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(params: {
    id?: ID;  // אופציונלי בפרמטרים
    eveningRate: number;
    memberDiscountRate: number;
    active: boolean;
    effectiveDate: DateISO;
    createdAt: DateISO;
    updatedAt: DateISO;
  }) {
    if (!params.id) {
      throw new Error("ID is required for LoungePricingModel instance.");
    }
    this.id = params.id;
    this.eveningRate = params.eveningRate;
    this.memberDiscountRate = params.memberDiscountRate;
    this.active = params.active;
    this.effectiveDate = params.effectiveDate;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  toDatabaseFormat() {
    return {
      evening_rate: this.eveningRate,
      member_discount_rate: this.memberDiscountRate,
      active: this.active,
      effective_date: this.effectiveDate,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
