import { AssignmentStatus, SpaceAssign } from "shared-types/src/spaceAssignment";

export class SpaceAssignmentModel implements SpaceAssign {
    id?: string;
    workspaceId: string;
    customerId: string;
    assignedDate: Date;
    unassignedDate?: Date;
    notes?: string;
    assignedBy: string;
    status: AssignmentStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(params: {
        id: string;
        workspaceId: string;
        customerId: string;
        assignedDate: Date;
        unassignedDate?: Date;
        notes?: string;
        assignedBy: string;
        status: AssignmentStatus;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = params.id || undefined;
        this.workspaceId = params.workspaceId;
        this.customerId = params.customerId;
        this.assignedDate = params.assignedDate;
        this.unassignedDate = params.unassignedDate;
        this.notes = params.notes;
        this.assignedBy = params.assignedBy;
        this.status = params.status;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }

    toDatabaseFormat() {
        return {
            workspace_id: this.workspaceId,
            customer_id: this.customerId,
            assigned_date: this.assignedDate,
            unassigned_date: this.unassignedDate,
            notes: this.notes,
            assigned_by: this.assignedBy,
            status: this.status,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }
}