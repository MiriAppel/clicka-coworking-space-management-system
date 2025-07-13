import { DateISO, ID, EmailTemplate } from "shared-types";

export class EmailTemplateModel implements EmailTemplate {
    id?: ID;
    name: string;
    subject: string;
    bodyHtml: string;
    bodyText: string;
    language: 'he' | 'en';
    variables: string[];
    createdAt: DateISO;
    updatedAt: DateISO;

    constructor(data: any) {
        this.id = data.id ?? undefined;
        this.name = data.name;
        this.subject = data.subject;
        this.bodyHtml = data.bodyHtml ?? data.body_html ?? '';
        this.bodyText = data.bodyText ?? data.body_text ?? '';
        this.language = data.language;
        this.variables = data.variables ?? [];
        this.createdAt = data.createdAt ?? data.created_at ?? new Date().toISOString();
        this.updatedAt = data.updatedAt ?? data.updated_at ?? new Date().toISOString();
    }

    toDatabaseFormat() {
        return {
            name: this.name,
            subject: this.subject,
            body_html: this.bodyHtml,
            body_text: this.bodyText,
            language: this.language,
            variables: this.variables,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }
}
