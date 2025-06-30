"use strict";
// booking-types.d.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = exports.RoomStatus = exports.RoomType = void 0;
// Room type enum
var RoomType;
(function (RoomType) {
    RoomType["MEETING_ROOM"] = "MEETING_ROOM";
    RoomType["LOUNGE"] = "LOUNGE";
})(RoomType || (exports.RoomType = RoomType = {}));
// Room status enum
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["AVAILABLE"] = "AVAILABLE";
    RoomStatus["OCCUPIED"] = "OCCUPIED";
    RoomStatus["MAINTENANCE"] = "MAINTENANCE";
    RoomStatus["INACTIVE"] = "INACTIVE";
})(RoomStatus || (exports.RoomStatus = RoomStatus = {}));
// Booking status enum
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["APPROVED"] = "APPROVED";
    BookingStatus["REJECTED"] = "REJECTED";
    BookingStatus["CANCELED"] = "CANCELED";
    BookingStatus["COMPLETED"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
