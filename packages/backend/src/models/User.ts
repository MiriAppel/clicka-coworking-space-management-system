import { ID, DateISO , User,UserRole} from "shared-types";

// User model
export class UserModel implements User{
    [x: string]: any;
    id: ID;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    googleId: string;
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
            lastLogin: this.lastLogin,
            active: this.active,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
