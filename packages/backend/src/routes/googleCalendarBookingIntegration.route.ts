import express from 'express'
import * as calendarSyncController from '../controllers/googleCalendarBookingIntegration.controller'

const routerSync = express.Router()
routerSync.get('/all', calendarSyncController.getAllCalendarSync.bind(calendarSyncController))
routerSync.get('/get/:id', calendarSyncController.getCalendarSyncById.bind(calendarSyncController))
routerSync.post('/post-sync', calendarSyncController.createCalendarSync.bind(calendarSyncController))
// routerSync.post('/add/:calendarId', calendarSyncController.createCalendarEvent.bind(calendarSyncController));
routerSync.patch('/update/:id', calendarSyncController.updateCalendarSync.bind(calendarSyncController))
routerSync.delete('/delete/:id', calendarSyncController.deleteCalendarSyncByEventId.bind(calendarSyncController))


export default routerSync
