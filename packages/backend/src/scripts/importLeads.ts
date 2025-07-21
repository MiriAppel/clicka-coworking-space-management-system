import * as XLSX from 'xlsx';
import fs from 'fs';
import { supabase } from '../db/supabaseClient';

function formatDate(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'number') {
    const excelStartDate = new Date(1900, 0, 1);
    const parsed = new Date(excelStartDate.getTime() + (value - 2) * 86400000);
    return parsed.toISOString().split('T')[0];
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0];
}
function normalizePhone(value: any): string {
  let phoneStr = String(value ?? '').replace(/\D/g, ''); // שמירה רק על ספרות

  // אם אין אפס מוביל – מוסיפים
  if (!phoneStr.startsWith('0')) {
    phoneStr = '0' + phoneStr;
  }

  return phoneStr;
}



const leadStatusMap: Record<string, string> = {
  'NEW': 'NEW',
  'CONTACTED': 'CONTACTED',
  'INTERESTED': 'INTERESTED',
  'SCHEDULED_TOUR': 'SCHEDULED_TOUR',
  'PROPOSAL_SENT': 'PROPOSAL_SENT',
  'CONVERTED': 'CONVERTED',
  'NOT_INTERESTED': 'NOT_INTERESTED',
  'LOST': 'LOST',
};

const leadSourceMap: Record<string, string> = {
  'WEBSITE': 'WEBSITE',
  'REFERRAL': 'REFERRAL',
  'SOCIAL_MEDIA': 'SOCIAL_MEDIA',
  'EVENT': 'EVENT',
  'PHONE': 'PHONE',
  'WALK_IN': 'WALK_IN',
  'EMAIL': 'EMAIL',
  'OTHER': 'OTHER',
};

const interestedInMap: Record<string, string> = {
  'OPEN_SPACE': 'OPEN_SPACE',
  'PRIVATE_ROOM': 'PRIVATE_ROOM',
  'DESK_IN_ROOM': 'DESK_IN_ROOM',
  'KLIKAH_CARD': 'KLIKAH_CARD',
};

async function importLeads() {
  const fileBuffer = fs.readFileSync('src/data/clickaLeadFields.xlsx');
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  console.log('📥 טוען גיליון:', workbook.SheetNames[0]);

  const rawData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
  const [headerRow, ...dataRows] = rawData;

  const headers = [
    'שם', 'טלפון', 'מייל', 'תחום העסק', 'מה מעניין את הלקוח',
    'איך ליצור קשר', 'תאריך ליד', 'תאריך שיחת מכירה', 'סטטוס', 'אופן פניה', 'הערות'
  ];

  for (const row of dataRows) {
    const rowObj: Record<string, any> = {};
     if (row[0] === 'שם') 
          continue;
    headers.forEach((key, i) => {
      rowObj[key] = row[i];
    });
 // ✅ בדיקה אם כל השורה ריקה
  const isEmptyRow = Object.values(rowObj).every(
    (val) => val === undefined || val === null || String(val).trim() === ''
  );
  if (isEmptyRow) continue;
    // בדיקה אם השדות המרכזיים ריקים
    if (!rowObj['שם'] || !rowObj['מייל'] || !rowObj['טלפון'] ) {
      //console.warn(`⚠️ שורה חסרה נתונים בסיסיים – דילוג: ${JSON.stringify(rowObj)}`);
      continue; // דילוג על השורה אם נתונים ריקים
    }
    const email = rowObj['מייל'];

    // אין יותר בדיקה אם הליד קיים, פשוט מוסיפים את הליד
    const status = leadStatusMap[(rowObj['סטטוס'] || '').toUpperCase()] || 'NEW';  // סטטוס ברירת מחדל
    const source = leadSourceMap[(rowObj['אופן פניה'] || '').toUpperCase()] || null;

    // שינוי: אם אין ערך בשדה, interested_in יהיה array ריק
    const interestedIn = rowObj['מה מעניין את הלקוח'] 
      ? [interestedInMap[(rowObj['מה מעניין את הלקוח'] || '')]] 
      : [];


    // הוספת ברירת מחדל ל-id_number במקרה שאין ערך
    const lead = {
      name: rowObj['שם'],
      phone: normalizePhone(rowObj['טלפון']),
      email:email,
      business_type: rowObj['תחום העסק'] || null,
      interested_in: interestedIn,  // הוספת הערך כ-array
      status: status ? status : 'NEW',  // ברירת מחדל אם סטטוס חסר
      source: source ? source : 'OTHER',  // ברירת מחדל אם מקור חסר
      notes: rowObj['הערות'] || null,
      id_number: rowObj['ת.ז.'] || 'UNKNOWN',  // ברירת מחדל אם ת.ז. חסרה
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!lead.status) {
      console.warn(`⚠️ סטטוס ליד לא תקין או חסר: "${rowObj['סטטוס']}" - דילוג על ליד: ${lead.name}`);
      continue;
    }

    if (!lead.source) {
      lead.source = 'OTHER'; // אם לא נמצא מקור
    }

    // הכנסת הליד לטבלת leads
    const { error } = await supabase.from('leads').insert(lead);
    if (error) {
      console.error('❌ שגיאה בהוספת ליד:', error.message);
      continue;
    }
    
    console.log('✅ ליד נוסף בהצלחה:', lead.name);

    const { data: insertedLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();

    if (insertedLead) {
      const leadId = insertedLead.id;

      // הכנסת נתונים לטבלת תקופות ליד
      const entryDate = formatDate(rowObj['תאריך ליד']);
      const contactDate = formatDate(rowObj['תאריך שיחת מכירה']);
      const exitDate = formatDate(rowObj['תאריך יציאה']) || '1900-01-01'; // ברירת מחדל אם חסר
      if (entryDate && contactDate) {
        const { error: periodError } = await supabase.from('lead_period').insert({
          lead_id: leadId,
          entry_date: entryDate,
          contact_date: contactDate,
          exit_date: exitDate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (periodError) {
          console.error('❌ שגיאה בהוספת תקופת ליד:', periodError.message);
        } else {
          console.log('✅ תקופה להיד נוסף בהצלחה');
        }
      }

      // הכנסת נתונים לטבלת lead_interaction
      const interactionDate = formatDate(rowObj['תאריך ליד']);
      if (!interactionDate) {
        console.error('❌ שגיאה: missing interaction date');
        continue;
      }

      const { error: interactionError } = await supabase.from('lead_interaction').insert({
        lead_id: leadId,
        date: interactionDate,  // השתמש ב-`date` במקום `interaction_date`
        type: rowObj['איך ליצור קשר'] || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (interactionError) {
        console.error('❌ שגיאה בהוספת אינטרקציה עם ליד:', interactionError.message);
      } else {
        console.log('✅ אינטרקציה עם ליד נוספה בהצלחה');
      }
    }
  }
}

importLeads();
