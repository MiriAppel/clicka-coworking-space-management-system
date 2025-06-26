import { DateISO, ID } from "shared-types";



export class UserTokens {
  id?: ID;
  userId: ID;
  accessToken:string;
  accessTokenExpiry: DateISO;
  refreshToken: string;
  activeSessionId: string | null = null;
  sessionCreatedAt: DateISO | null = null; // add session creation time
  lastActivityAt: DateISO | null = null;   // add last activity time
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: ID,
    userId: ID,
    accessToken:string,
  accessTokenExpiry: DateISO,
    refreshToken: string,
    createdAt: DateISO,
    updatedAt: DateISO,
    activeSessionId?: string | null,
    sessionCreatedAt?: DateISO | null,
    lastActivityAt?: DateISO | null
  ) {
    this.id = id;
    this.userId = userId;
    this.accessToken = accessToken;
    this.accessTokenExpiry = accessTokenExpiry;
    this.refreshToken = refreshToken;
    this.activeSessionId = activeSessionId || null;
    this.sessionCreatedAt = sessionCreatedAt || null;
    this.lastActivityAt = lastActivityAt || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      userId: this.userId,
      accessToken:this.accessToken,
      accessTokenExpiry: this.accessTokenExpiry,
      refreshToken: this.refreshToken,
      activeSessionId: this.activeSessionId,
      sessionCreatedAt: this.sessionCreatedAt,
      lastActivityAt: this.lastActivityAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

