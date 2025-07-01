

// דוגמה למימוש של פונקציות שיכולות להשתמש בטיפוסים

import type{ CreateSpaceRequest, DateISO, GetSpacesRequest, ID, Space, UpdateSpaceRequest } from "shared-types";
import { SpaceStatus } from "shared-types";

export class SpaceModel {
    private spaces: Space[] = [];

    // פונקציה להוסיף מקום חדש
    createSpace(request: CreateSpaceRequest): Space {
        const newSpace: Space = {
            id: this.generateId(),
            name: request.name,
            description: request.description,
            type: request.type,
            status: SpaceStatus.AVAILABLE,
            room: request.room,
            positionX: request.positionX,
            positionY: request.positionY,
            width: request.width,
            height: request.height,
            createdAt: new Date().toISOString() as DateISO,
            updatedAt: new Date().toISOString() as DateISO,
        };
        this.spaces.push(newSpace);
        return newSpace;
    }

    // פונקציה לעדכון מקום קיים
    updateSpace(id: ID, request: UpdateSpaceRequest): Space | undefined {
        const space = this.spaces.find(space => space.id === id);
        if (space) {
            Object.assign(space, request, { updatedAt: new Date().toISOString() as DateISO });
            return space;
        }
        return undefined;
    }

    // פונקציה לקבלת מקומות לפי בקשה
    getSpaces(request: GetSpacesRequest): Space[] {
        // לוגיקה לסינון מקומות לפי הבקשה
        return this.spaces; // החזר את כל המקומות לדוגמה
    }

    // פונקציה ליצירת מזהה ייחודי
    private generateId(): ID {
        return Math.random().toString(36).substr(2, 9) as ID; // דוגמה ליצירת מזהה
    }
}
