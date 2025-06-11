"use strict";
// report-types.d.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportFormat = exports.TimePeriod = void 0;
// Time period enum
var TimePeriod;
(function (TimePeriod) {
    TimePeriod["DAILY"] = "DAILY";
    TimePeriod["WEEKLY"] = "WEEKLY";
    TimePeriod["MONTHLY"] = "MONTHLY";
    TimePeriod["QUARTERLY"] = "QUARTERLY";
    TimePeriod["YEARLY"] = "YEARLY";
})(TimePeriod || (exports.TimePeriod = TimePeriod = {}));
// Export format
var ExportFormat;
(function (ExportFormat) {
    ExportFormat["CSV"] = "CSV";
    ExportFormat["PDF"] = "PDF";
    ExportFormat["EXCEL"] = "EXCEL";
})(ExportFormat || (exports.ExportFormat = ExportFormat = {}));
