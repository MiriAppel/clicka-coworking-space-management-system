import { DateISO, ID } from "../types/core";

export abstract class Person {
  id!: ID;
  name!: string;
  phone!: string;
  email!: string;
  businessType!: string;
  notes?: string;
  createdAt!: DateISO;
  updatedAt!: DateISO;

  constructor(data: Partial<Person>) {
    Object.assign(this, data);
  }
}

