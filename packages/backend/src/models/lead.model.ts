import { Lead } from "../types/lead";

class LeadModel implements Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;

    constructor(id: string, name: string, email: string, phone: string, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.createdAt = createdAt;
    }
}

export { LeadModel };
