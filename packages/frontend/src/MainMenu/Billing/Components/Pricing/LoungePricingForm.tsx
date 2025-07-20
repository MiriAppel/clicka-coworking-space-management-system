import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber';
import { useLoungePricingStore } from '../../../../Stores/Billing/pricing/loungePricingStore';
import { UpdateLoungePricingRequest } from 'shared-types';

interface Props {
  initialData?: any; 
  onSuccess?: () => void; 
}

const LoungePricingForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const methods = useForm<UpdateLoungePricingRequest>({
    defaultValues: {
      eveningRate: 0,
      memberDiscountRate: 0,
      effectiveDate: '',
    },
  });

  const { save, error, loading } = useLoungePricingStore();

  useEffect(() => {
    if (initialData) {
      methods.reset({
        ...initialData,
        memberDiscountRate: initialData.memberDiscountRate * 100, 
        effectiveDate: initialData.effectiveDate ? initialData.effectiveDate.split('T')[0] : '', 
      });
    } else {
      methods.reset({
        eveningRate: 0,
        memberDiscountRate: 0,
        effectiveDate: '',
      });
    }
    methods.clearErrors(); 
  }, [initialData, methods]);

  const onSubmit = async (data: UpdateLoungePricingRequest) => {
    methods.clearErrors(); 

    try {
      const dataToSend = {
        ...data,
        memberDiscountRate: data.memberDiscountRate / 100, 
      };

      // *** השינוי העיקרי כאן: לוודא שליחת ID במצב עדכון ***
      await save(dataToSend, initialData?.id); // העבר את ה-initialData.id לפונקציית save
      // *** הסטור צריך לדעת האם מדובר ביצירה או עדכון לפי קיומו של ה-ID
      // לכן אנחנו מעבירים לו את initialData.id כארגומנט שני ***

      alert('הפעולה בוצעה בהצלחה!');
      onSuccess?.(); 
    } catch (e: any) {
      const errorMessage = e.message || 'אירעה שגיאה לא ידועה בשמירה';
      
      if (errorMessage.includes('תאריך התחולה') && errorMessage.includes('מתנגש עם שכבה קיימת')) {
        const dateMatch = errorMessage.match(/(\d{4}-\d{2}-\d{2})/);
        const conflictingDate = dateMatch ? dateMatch[0] : 'לא ידוע';
        
        methods.setError('effectiveDate', {
          type: 'manual',
          message: `שגיאה: תאריך התחולה ${conflictingDate} כבר קיים. אנא בחר תאריך אחר, או עדכן את הרשומה הקיימת.`,
        });
      } else if (errorMessage.includes('תאריך התחילה') || errorMessage.includes('effectiveDate')) {
        methods.setError('effectiveDate', {
          type: 'manual',
          message: errorMessage,
        });
      } else {
        console.error('שגיאה בשמירה:', errorMessage);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-4 p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {initialData ? "עדכון מחיר לאונג'" : "יצירת מחיר חדש לאונג'"}
        </h3>

        <NumberInputField
          name="eveningRate"
          label="תעריף ערב"
          required
          min={0}
        />
        <NumberInputField
          name="memberDiscountRate"
          label="הנחה לחברים (%)"
          required
          min={0}
          max={100}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">תאריך תחילה</label>
          <input
            type="date"
            {...methods.register('effectiveDate', { required: 'שדה חובה' })}
            className="border px-3 py-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
            disabled={!!initialData} 
          />
          {methods.formState.errors.effectiveDate && (
            <p className="text-red-500 text-sm">
              {methods.formState.errors.effectiveDate.message}
            </p>
          )}
        </div>

        {error && 
          !methods.formState.errors.effectiveDate && 
          !(error.includes('תאריך התחולה') && error.includes('מתנגש עם שכבה קיימת')) && 
          <p className="text-red-500 text-sm">{error}</p>
        } 

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'שומר...' : (initialData ? 'עדכון מחיר' : 'יצירת מחיר חדש')}
        </button>
      </form>
    </FormProvider>
  );
};

export default LoungePricingForm;