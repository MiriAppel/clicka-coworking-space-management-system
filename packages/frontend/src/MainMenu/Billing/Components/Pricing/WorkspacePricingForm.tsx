import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber';
import { useWorkspacePricingStore } from '../../../../Stores/Billing/pricing/workspacePricingStore';
import { UpdatePricingTierRequest } from 'shared-types';
import { WorkspaceType } from 'shared-types/customer';
import { showAlert } from '../../../../Common/Components/BaseComponents/BaseAlert'; 

// ----------------------
// Props להגדרת הקומפוננטה
// ----------------------
interface Props {
  workspaceType: WorkspaceType;   // סוג סביבת העבודה
  initialData?: any;              // ערכים לעריכה אם קיימים
  onSuccess?: () => void;         // callback לאחר שמירה מוצלחת
}

const WorkspacePricingForm: React.FC<Props> = ({ workspaceType, initialData, onSuccess }) => {
  // ----------------------
  // הגדרת הטופס עם ערכי ברירת מחדל
  // ----------------------
  const methods = useForm<UpdatePricingTierRequest & { id?: string }>({
    defaultValues: {
      year1Price: 0,
      year2Price: 0,
      year3Price: 0,
      year4Price: 0,
      workspaceType,
      effectiveDate: '',
      id: initialData?.id || undefined,
    },
  });

  const { save, loading } = useWorkspacePricingStore();

  // ----------------------
  // איפוס ערכים בטופס בהתאם לנתוני העריכה (אם יש)
  // ----------------------
  useEffect(() => {
    if (initialData) {
      methods.reset({
        ...initialData,
        effectiveDate: initialData.effectiveDate?.split('T')[0] || '',
        id: initialData.id,
      });
    } else {
      methods.reset({
        year1Price: 0,
        year2Price: 0,
        year3Price: 0,
        year4Price: 0,
        workspaceType,
        effectiveDate: '',
        id: undefined,
      });
    }
    methods.clearErrors();
  }, [initialData, methods, workspaceType]);

  // ----------------------
  // טיפול בשליחה
  // ----------------------
  const onSubmit = async (data: UpdatePricingTierRequest & { id?: string }) => {
    methods.clearErrors('effectiveDate');

    try {
      const dataToSend = { ...data, workspaceType };
      await save(dataToSend, initialData?.id);

      showAlert({
        icon: 'success',
        title: 'הפעולה בוצעה בהצלחה!',
        text: initialData
          ? 'תמחור סביבת העבודה עודכן בהצלחה.'
          : 'תמחור סביבת העבודה נוצר בהצלחה.',
      });

      onSuccess?.();

      // איפוס הטופס רק במקרה של יצירה חדשה
      if (!initialData) {
        methods.reset({
          year1Price: 0,
          year2Price: 0,
          year3Price: 0,
          year4Price: 0,
          workspaceType,
          effectiveDate: '',
          id: undefined,
        });
      }
    } catch (e: any) {
      let message = e?.message || 'אירעה שגיאה בלתי צפויה בשמירה';
      console.error('שגיאה בשמירה:', message, e);

      // טיפול בשגיאות תאריך התחולה המתנגשות
      if (
        message.includes('תאריך התחולה') &&
        message.includes('מתנגש עם שכבה קיימת')
      ) {
        const dateMatch = message.match(/(\d{4}-\d{2}-\d{2})/);
        const conflictingDate = dateMatch ? dateMatch[0] : 'לא ידוע';

        message = `שגיאה: תאריך התחולה ${conflictingDate} כבר קיים עבור סוג סביבת עבודה זו. אנא בחר תאריך אחר, או עדכן את הרשומה הקיימת.`;

        methods.setError('effectiveDate', {
          type: 'manual',
          message,
        });

        showAlert({
          icon: 'error',
          title: 'שגיאת תאריך!',
          text: message,
        });
      }
      // טיפול בשגיאות כלליות הקשורות לשדה תאריך תחולה
      else if (message.includes('תאריך תחולה') || message.includes('effectiveDate')) {
        methods.setError('effectiveDate', {
          type: 'manual',
          message,
        });

        showAlert({
          icon: 'error',
          title: 'שגיאת תאריך!',
          text: message,
        });
      }
      // שגיאה כללית אחרת
      else {
        showAlert({
          icon: 'error',
          title: 'שגיאה!',
          text: `שגיאה בשמירה: ${message}`,
        });
      }
    }
  };

  // ----------------------
  // UI - טופס
  // ----------------------
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="grid gap-4 p-4 border rounded-lg bg-white shadow-sm"
      >
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
            disabled={!!initialData}
          />
          {methods.formState.errors.effectiveDate && (
            <p className="text-red-500 text-sm">{methods.formState.errors.effectiveDate.message}</p>
          )}
        </div>

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
