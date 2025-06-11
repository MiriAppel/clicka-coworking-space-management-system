"use strict";
// customer-types.d.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitReason = exports.CustomerStatus = exports.WorkspaceType = void 0;
// Workspace type enum
var WorkspaceType;
(function (WorkspaceType) {
    WorkspaceType["PRIVATE_ROOM"] = "PRIVATE_ROOM";
    WorkspaceType["DESK_IN_ROOM"] = "DESK_IN_ROOM";
    WorkspaceType["OPEN_SPACE"] = "OPEN_SPACE";
    WorkspaceType["KLIKAH_CARD"] = "KLIKAH_CARD";
})(WorkspaceType || (exports.WorkspaceType = WorkspaceType = {}));
// Customer status enum
var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["ACTIVE"] = "ACTIVE";
    CustomerStatus["NOTICE_GIVEN"] = "NOTICE_GIVEN";
    CustomerStatus["EXITED"] = "EXITED";
    CustomerStatus["PENDING"] = "PENDING";
})(CustomerStatus || (exports.CustomerStatus = CustomerStatus = {}));
// Exit reason enum
var ExitReason;
(function (ExitReason) {
    ExitReason["RELOCATION"] = "RELOCATION";
    ExitReason["BUSINESS_CLOSED"] = "BUSINESS_CLOSED";
    ExitReason["PRICE"] = "PRICE";
    ExitReason["WORK_FROM_HOME"] = "WORK_FROM_HOME";
    ExitReason["SPACE_NEEDS"] = "SPACE_NEEDS";
    ExitReason["DISSATISFACTION"] = "DISSATISFACTION";
    ExitReason["OTHER"] = "OTHER";
})(ExitReason || (exports.ExitReason = ExitReason = {}));
