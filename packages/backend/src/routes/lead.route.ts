// import express from 'express';
// import * as leadController from '../controllers/lead.controller'; 
// import * as interactionController from '../controllers/interaction.controller'

// const router = express.Router();

// router.get('/', leadController.getAllLeads);
// router.get('/reminders/open', leadController.getOpenReminders); // חדש: תזכורות פתוחות
// router.get('/remind', leadController.getLeadToRemind); // לידים שדורשים מעקב
// router.get('/interactions', interactionController.getAllInteractions); // חדש: כל האינטראקציות
// router.get('/email/:email', leadController.getLeadByEmail);
// router.get('/phone/:phone', leadController.getLeadByPhone);
// router.get('/name/:name', leadController.getLeadByName);
// router.get('/status/:status', leadController.getLeadByStatus);
// router.get('/source/:source', leadController.getLeadBySource);
// router.get('/:id', leadController.getLeadById);
// router.get('/:id/sources', leadController.getSourcesLeadById);
// router.get('/:leadId/check-customer', leadController.checkIfLeadBecomesCustomer); // שימוש ב-leadId ב-params

// // ---  (POST) ---
// router.post('/', leadController.createLead);
// router.post('/csv/add', leadController.addLeadFromCSV); // שונה כדי למנוע בלבול עם המרה
// router.post('/csv/convert', leadController.convertCsvToLeads); // חדש: המרת CSV ללידים
// router.post('/interactions/:leadId', interactionController.postInteractionToLead); // נוסף leadId ב-params

// // ---  (PUT/PATCH) ---
// router.put('/:id', leadController.fullUpdateLead); // השם תואם ל-service
// router.put('/interactions/:id', interactionController.patchInteractions); // עדכון אינטראקציה לפי ID האינטראקציה
// router.post('/check-full', leadController.checkIfFullLead); // חדש: בדיקת ליד מלא
// // router.post('/interactions/check-full', leadController.checkIfFullInteraction); // חדש: בדיקת אינטראקציה מלאה

// // ---  (DELETE) ---
// router.delete('/interactions/:id', interactionController.deleteInteraction); // חדש: מחיקת אינטראקציה


// export default router;
