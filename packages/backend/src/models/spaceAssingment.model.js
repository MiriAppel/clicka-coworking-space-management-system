"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceModel = void 0;
class SpaceModel {
    id;
    workspaceId;
    customerId;
    assignedDate;
    unassignedDate;
    notes;
    assignedBy;
    status;
    createdAt;
    updatedAt;
    constructor(params) {
        this.id = params.id;
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
            id: this.id,
            workspaceId: this.workspaceId,
            customerId: this.customerId,
            assignedDate: this.assignedDate,
            unassignedDate: this.unassignedDate,
            notes: this.notes,
            assignedBy: this.assignedBy,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.SpaceModel = SpaceModel;
