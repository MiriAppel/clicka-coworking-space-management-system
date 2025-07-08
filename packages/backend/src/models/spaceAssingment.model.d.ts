import { AssignmentStatus, SpaceAssign } from "@types/spaceAssignment";
export declare class SpaceModel implements SpaceAssign {
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
    constructor(params: SpaceAssign);
    toDatabaseFormat(): {
        id: string | undefined;
        workspaceId: string;
        customerId: string;
        assignedDate: Date;
        unassignedDate: Date | undefined;
        notes: string | undefined;
        assignedBy: string;
        status: AssignmentStatus;
        createdAt: Date;
        updatedAt: Date;
    };
}
