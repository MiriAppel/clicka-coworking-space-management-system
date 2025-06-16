export enum WorkspaceType {
  PRIVATE_ROOM = 'PRIVATE_ROOM',
  DESK_IN_ROOM = 'DESK_IN_ROOM',
  OPEN_SPACE = 'OPEN_SPACE',
  KLIKAH_CARD = 'KLIKAH_CARD'
}
export enum SpaceStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE'
}
export type DateISO = string;
// ID type (string for UUIDs, or number for auto-increment)
export type ID = string;

export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED'
}