import { ID, DateISO } from "../../../../types/core";
import { User,UserRole } from "../../../../types/auth";

// User model
export class UserModel implements User{
    [x: string]: any;
    id: ID;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    googleId: string;
    access_token:string;
    refresh_token:string;
    lastLogin?: DateISO;
    active: boolean;
    createdAt: DateISO;
    updatedAt: DateISO;

    constructor(
        id: ID,
        email: string,
        firstName: string,
        lastName: string,
        role: UserRole, 
        googleId: string,
        access_token:string,
        refresh_token:string,
        active: boolean,
        createdAt: DateISO,
        updatedAt: DateISO,
        lastLogin?: DateISO,
    ) {
        this.id = id;
        this.email = email;
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.role = role;
        this.googleId = googleId;
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.lastLogin = lastLogin;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    // Convert the user model to a format suitable for database storage
    toDatabaseFormat() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            googleId: this.googleId,
            access_token: this.access_token,
            refresh_token: this.refresh_token,
            lastLogin: this.lastLogin,
            active: this.active,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
