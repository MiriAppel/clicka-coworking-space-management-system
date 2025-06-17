import { DateISO, DateRangeFilter, ID } from "../../types/core";
import { WorkspaceType } from "../../types/customer";

// מחלקה לשאילתת זמינות
export class AvailabilityQuery {
  workspaceTypes?: WorkspaceType[];
  startDate: DateISO;
  endDate?: DateISO;
  includeMaintenanceSchedule?: boolean;
  includeReservedSpaces?: boolean;

  constructor(params: {
    workspaceTypes?: WorkspaceType[];
    startDate: DateISO;
    endDate?: DateISO;
    includeMaintenanceSchedule?: boolean;
    includeReservedSpaces?: boolean;
  }) {
    this.workspaceTypes = params.workspaceTypes;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.includeMaintenanceSchedule = params.includeMaintenanceSchedule;
    this.includeReservedSpaces = params.includeReservedSpaces;
  }

  toDatabaseFormat() {
    return {
      workspaceTypes: this.workspaceTypes,
      startDate: this.startDate,
      endDate: this.endDate,
      includeMaintenanceSchedule: this.includeMaintenanceSchedule,
      includeReservedSpaces: this.includeReservedSpaces,
    };
  }
}





