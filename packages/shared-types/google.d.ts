import { FileReference } from './core';
export interface GoogleOAuthTokenData {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
    tokenType: string;
    scope: string;
}
export interface GoogleCalendarEvent {
    id: string;
    calendarId: string;
    summary: string;
    description?: string;
    location?: string;
    start: {
        dateTime: string;
        timeZone?: string;
    };
    end: {
        dateTime: string;
        timeZone?: string;
    };
    attendees?: {
        email: string;
        displayName?: string;
        responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    }[];
    status: 'confirmed' | 'tentative' | 'cancelled';
    created: string;
    updated: string;
    htmlLink: string;
}
export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    webViewLink: string;
    webContentLink?: string;
    thumbnailLink?: string;
    parents?: string[];
    createdTime: string;
    modifiedTime: string;
    size?: string;
}
export interface CreateGoogleCalendarEventRequest {
    calendarId: string;
    summary: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime: string;
    attendees?: string[];
    sendNotifications?: boolean;
    timezone?: string;
}
export interface UpdateGoogleCalendarEventRequest {
    calendarId: string;
    eventId: string;
    summary?: string;
    description?: string;
    location?: string;
    startDateTime?: string;
    endDateTime?: string;
    attendees?: string[];
    sendNotifications?: boolean;
    timezone?: string;
}
export interface DeleteGoogleCalendarEventRequest {
    calendarId: string;
    eventId: string;
    sendNotifications?: boolean;
}
export interface GetGoogleCalendarEventsRequest {
    calendarId: string;
    timeMin: string;
    timeMax: string;
    maxResults?: number;
    q?: string;
}
export interface UploadToDriveRequest {
    name: string;
    content: File | Blob | string;
    mimeType: string;
    folderId?: string;
    description?: string;
}
export interface UploadToDriveResponse {
    file: GoogleDriveFile;
    fileReference: FileReference;
}
export interface GetDriveFilesRequest {
    folderId?: string;
    q?: string;
    mimeType?: string;
    maxResults?: number;
}
export interface CreateDriveFolderRequest {
    name: string;
    parentFolderId?: string;
    description?: string;
}
export interface SendEmailRequest {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    isHtml?: boolean;
    attachments?: {
        name: string;
        content: Blob | string;
        mimeType: string;
    }[];
}
