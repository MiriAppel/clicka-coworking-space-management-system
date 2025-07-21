import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import cron from 'node-cron';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // נדרש להרשאות עדכון
);

const updateContracts = async () => {
  const today = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

  /* ========== EXPIRED-שלב 1: עדכון חוזים שפג תוקפם ל- ========== */
  const { data: expiredContracts, error: fetchExpiredError } = await supabase
    .from('contract')
    .select('id')
    .eq('status', 'ACTIVE')
    .eq('end_date', today);

  if (fetchExpiredError) {
    console.error('❌ שגיאה בשליפת חוזים שפג תוקפם:', fetchExpiredError);
  } else if (expiredContracts && expiredContracts.length > 0) {
    const expiredIds = expiredContracts.map((c) => c.id);

    const { error: updateExpiredError } = await supabase
      .from('contract')
      .update({ status: 'EXPIRED' })
      .in('id', expiredIds);

    if (updateExpiredError) {
      console.error('❌ שגיאה בעדכון חוזים ל-EXPIRED:', updateExpiredError);
    } else {
      console.log(`✅ עודכנו ${expiredIds.length} חוזים לסטטוס EXPIRED`);
    }
  } else {
    console.log('ℹ️ אין חוזים שפג תוקפם היום.');
  }

  /* ========== ACTIVE-שלב 2: עדכון חוזים שנכנסים מחר לתוקף ל- ========== */
  const { data: activeContracts, error: fetchActiveError } = await supabase
    .from('contract')
    .select('id')
    .eq('status', 'SIGNED')
    .in('start_date', [tomorrow]); 

  if (fetchActiveError) {
    console.error('❌ שגיאה בשליפת חוזים שנכנסים לתוקף:', fetchActiveError);
  } else if (activeContracts && activeContracts.length > 0) {
    const activeIds = activeContracts.map((c) => c.id);

    const { error: updateActiveError } = await supabase
      .from('contract')
      .update({ status: 'ACTIVE' })
      .in('id', activeIds);

    if (updateActiveError) {
      console.error('❌ שגיאה בעדכון חוזים ל-ACTIVE:', updateActiveError);
    } else {
      console.log(`✅ עודכנו ${activeIds.length} חוזים לסטטוס ACTIVE`);
    }
  } else {
    console.log('ℹ️ אין חוזים שנכנסים היום או מחר לתוקף.');
  }
};

// ✅ ירוץ כל יום בשעה 22:00
cron.schedule("0 22 * * *", () => {
  console.log("🔥 cron רץ לבדיקת חוזים בשעה 22:00...");
  updateContracts();
});
