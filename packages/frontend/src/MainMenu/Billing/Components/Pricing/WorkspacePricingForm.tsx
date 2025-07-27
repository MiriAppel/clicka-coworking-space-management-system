import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber';
import { useWorkspacePricingStore } from '../../../../Stores/Billing/pricing/workspacePricingStore';
import { UpdatePricingTierRequest } from 'shared-types';
import { WorkspaceType } from 'shared-types/customer';

interface Props {
  workspaceType: WorkspaceType;
  initialData?: any; // אובייקט עם נתונים ראשוניים כולל ID
  onSuccess?: () => void; // פונקציה לקריאה לאחר שמירה מוצלחת
}

const WorkspacePricingForm: React.FC<Props> = ({ workspaceType, initialData, onSuccess }) => {
  const methods = useForm<UpdatePricingTierRequest & { id?: string }>({ // הוספנו id לטיפוס
    defaultValues: {
      year1Price: 0,
      year2Price: 0,
      year3Price: 0,
      year4Price: 0,
      workspaceType: workspaceType,
      effectiveDate: '',
      id: initialData?.id || undefined, // אם יש initialData, נגדיר את ה-ID
    },
  });

  // כעת, ה-loading וה-error מ-Zustand ישמשו רק לתצוגת סטטוס גלובלי,
  // אך השגיאות הספציפיות יטופלו ישירות ב-onSubmit
  const { save, loading, error } = useWorkspacePricingStore();

  // אפקט לאיפוס הטופס עם initialData כאשר הוא משתנה
  useEffect(() => {
    if (initialData) {
      methods.reset({
        ...initialData,
        effectiveDate: initialData.effectiveDate?.split('T')[0] || '', // ודא פורמט תאריך נכון
        id: initialData.id, // ודא שה-ID נשמר
      });
    } else {
      // אם אין initialData, נאפס לערכי ברירת מחדל (מצב יצירה)
      methods.reset({
        year1Price: 0,
        year2Price: 0,
        year3Price: 0,
        year4Price: 0,
        workspaceType: workspaceType, // ודא שה-workspaceType נשמר
        effectiveDate: '',
        id: undefined,
      });
    }
  }, [initialData, methods, workspaceType]);

 const onSubmit = async (data: UpdatePricingTierRequest & { id?: string }) => { 
    // נקה שגיאות קודמות של effectiveDate אם היו
    methods.clearErrors('effectiveDate');

    try {
      // אם קיים ID, זהו עדכון (PUT), אחרת זהו יצירה (POST)
      // קרא לפונקציית save מהסטור
       const dataToSend = { ...data, workspaceType };
    // כאן, אל תשים את ה-ID בתוך dataToSend
    // אלא שלח אותו כפרמטר נפרד ל-save:
    await save(dataToSend, initialData?.id); // <
      // אם הגענו לכאן, זה אומר ש-save הצליח (הוא לא זרק שגיאה)
      alert('השמירה בוצעה בהצלחה!');
      onSuccess?.(); // קרא לפונקציית onSuccess מפרופס
      
      // אופציונלי: אפס את הטופס עם הנתונים שנשמרו, או לערכי ברירת מחדל ליצירה חדשה
      if (!initialData) { // רק אם זה יצירה חדשה
          methods.reset({ // איפוס הטופס לערכי ברירת מחדל
              year1Price: 0,
              year2Price: 0,
              year3Price: 0,
              year4Price: 0,
              workspaceType: workspaceType,
              effectiveDate: '',
              id: undefined,
          });
      } else {
          // עבור עדכון, אולי תרצה לשמור את הנתונים המעודכנים בטופס
          // methods.reset(dataToSend); // או לא לאפס כלל
      }

    } catch (e: any) {
      // ה-catch הזה ייתפס כאשר save ב-Zustand store זורק את השגיאה
      const message = e?.message || 'אירעה שגיאה בלתי צפויה בשמירה';
      console.error('שגיאה בשמירה:', message, e); // לוג מפורט יותר

      // הצג את השגיאה הספציפית על שדה התאריך אם היא קשורה אליו
      if (message.includes('תאריך התחולה')) { // או 'תאריך תוקף', תלוי בנוסח המדויק
        methods.setError('effectiveDate', {
          type: 'manual',
          message,
        });
      } else {
        // אם זו שגיאה אחרת, הצג אותה באלרט כללי או באזור שגיאות אחר
        alert(`שגיאה בשמירה: ${message}`);
      }
    }
  };
// const onSubmit2 = async (data: UpdatePricingTierRequest & { id?: string }) => {
//     // ...
//     const dataToSend = { ...data, workspaceType };
//     // כאן, אל תשים את ה-ID בתוך dataToSend
//     // אלא שלח אותו כפרמטר נפרד ל-save:
//     await save(dataToSend, initialData?.id); // <--- שלח את ה-ID כפרמטר שני!
//     // ...
// };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-4 p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">
          {initialData ? 'עדכון תמחור לסביבת עבודה' : 'יצירת תמחור חדש לסביבת עבודה'}
        </h3>
        
        <NumberInputField name="year1Price" label="מחיר שנה 1" required min={0} />
        <NumberInputField name="year2Price" label="מחיר שנה 2" required min={0} />
        <NumberInputField name="year3Price" label="מחיר שנה 3" required min={0} />
        <NumberInputField name="year4Price" label="מחיר שנה 4" required min={0} />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">תאריך תחולה</label>
          <input
            type="date"
            {...methods.register('effectiveDate', { required: 'שדה חובה' })}
            className="border px-3 py-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
            // תאריך תחולה יהיה ניתן לעריכה רק ביצירה, לא בעדכון (כי הוא חלק מה-ID הלוגי)
            disabled={!!initialData} 
          />
          {methods.formState.errors.effectiveDate && (
            <p className="text-red-500 text-sm">{methods.formState.errors.effectiveDate.message}</p>
          )}
        </div>
        
        {/* תצוגת loading ו-error גלובליים מה-store, אם תרצה.
            השגיאה הספציפית לתאריך תופיע מעל שדה התאריך.
            ה-error הגלובלי יוצג אם היתה שגיאה שלא קשורה לתאריך, או כשאין setError לשדה מסוים.
        */}
        {loading && <p className="text-blue-600">שומר...</p>}
        {error && !methods.formState.errors.effectiveDate && <p className="text-red-500">{error}</p>}
        
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
          disabled={loading}
        >
          שמור
        </button>
      </form>
    </FormProvider>
  );
};

export default WorkspacePricingForm;