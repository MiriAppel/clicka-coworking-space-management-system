// זה יכול להיות ב־src/routes/index.ts או בכל router אחר שמחובר
import express from 'express';
const router = express.Router();

// שינוי הנתיב ל-root של הראוטר
router.get('/', (req, res) => {
  console.log('Health endpoint called');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
