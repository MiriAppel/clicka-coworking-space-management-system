import { DateISO } from "shared-types";
import { UserTokens } from "../models/userTokens.models";

export class sessionManager {

// return true if there is an active session
    hasActiveSession(activeSessionId:string): boolean {
        return activeSessionId !== null;
    }

    // set a new session
    setActiveSession(userTokens: UserTokens): void {
        userTokens.activeSessionId = userTokens.id;
        userTokens.sessionCreatedAt = new Date().toISOString() as DateISO;
        userTokens.lastActivityAt = new Date().toISOString() as DateISO;
        userTokens.updatedAt = new Date().toISOString() as DateISO;
    }

    // revoke a session
    revokeSession(userTokens: UserTokens): void {
        userTokens.activeSessionId = null;
        userTokens.sessionCreatedAt = null;
        userTokens.lastActivityAt = null;
        userTokens.updatedAt = new Date().toISOString() as DateISO;
    }

    // update activity
    updateActivity(userTokens: UserTokens): void {
        userTokens.lastActivityAt = new Date().toISOString() as DateISO;
        userTokens.updatedAt = new Date().toISOString() as DateISO;
    }




}