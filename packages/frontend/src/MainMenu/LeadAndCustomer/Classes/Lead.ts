import { DateISO } from "../types/core";
import { WorkspaceType } from "../types/customer";
import { LeadInteraction, LeadSource, LeadStatus } from "../types/lead";
import { Person } from "./Person";


export class Lead extends Person {
  interestedIn!: WorkspaceType[];
  source!: LeadSource;
  status!: LeadStatus;
  contactDate?: DateISO;
  followUpDate?: DateISO;
  interactions!: LeadInteraction[];
}
