export class SpaceAssignmentModel {
    id?: string;
    workspaceId: string;
    customerId: string;
    assignedDate: string;
    unassignedDate?: string;
    notes?: string;
    assignedBy: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(params: any) {
        this.id = params.id;
        this.workspaceId = params.workspaceId;
        this.customerId = params.customerId;
        this.assignedDate = params.assignedDate;
        this.unassignedDate = params.unassignedDate;
        this.notes = params.notes;
        this.assignedBy = params.assignedBy;
        this.status = params.status;
        this.createdAt = params.createdAt || params.created_at;
        this.updatedAt = params.updatedAt || params.updated_at;
    }

    toDatabaseFormat() {
        const data: any = {
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

        // רק אם יש id - הוסף אותו
        if (this.id) {
            data.id = this.id;
        }

        return data;
    }

    static fromDatabaseFormat(data: any): SpaceAssignmentModel {
        return new SpaceAssignmentModel({
            id: data.id,
            workspaceId: data.workspace_id,
            customerId: data.customer_id,
            assignedDate: data.assigned_date,
            unassignedDate: data.unassigned_date,
            notes: data.notes,
            assignedBy: data.assigned_by,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
}
