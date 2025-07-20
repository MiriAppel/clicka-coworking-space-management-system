// MeetingRoomPricingForm.tsx
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { NumberInputField } from '../../../../Common/Components/BaseComponents/InputNumber'; 
import { useMeetingRoomPricingStore } from '../../../../Stores/Billing/pricing/meetingRoomPricingStore';
import { UpdateMeetingRoomPricingRequest } from 'shared-types';

interface Props {
  initialData?: any; 
  onSuccess?: () => void; 
}

const MeetingRoomPricingForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const methods = useForm<UpdateMeetingRoomPricingRequest>({ 
    defaultValues: {
      hourlyRate: 0,
      discountedHourlyRate: 0,
      freeHoursKlikahCard: 0,
      effectiveDate: '',
    },
  });

  const { save, loading, error } = useMeetingRoomPricingStore(); 
  // אם אתה מפעיל את פונקציית המחיקה (delete) מתוך טופס זה (למשל, כפתור מחיקה),
  // תצטרך לייבא אותה כאן: const { save, loading, error, delete: deletePrice } = useMeetingRoomPricingStore();

  useEffect(() => {
    if (initialData) {
      methods.reset({
        ...initialData,
        effectiveDate: initialData.effectiveDate?.split('T')[0] || '', 
      });
    } else {
      methods.reset({
        hourlyRate: 0,
        discountedHourlyRate: 0,
        freeHoursKlikahCard: 0,
        effectiveDate: '',
      });
    }
    methods.clearErrors(); 
  }, [initialData, methods]);

  const onSubmit = async (data: UpdateMeetingRoomPricingRequest) => {
    methods.clearErrors(); 

    try {
      await save(data, initialData?.id);

      alert('השמירה בוצעה בהצלחה!');
      onSuccess?.(); 
    } catch (e: any) {
      const errorMessage = e?.message || 'אירעה שגיאה בשמירה';
      
      if (errorMessage.includes('תאריך התחולה') && errorMessage.includes('מתנגש עם שכבה קיימת')) {
        const dateMatch = errorMessage.match(/(\d{4}-\d{2}-\d{2})/);
        const conflictingDate = dateMatch ? dateMatch[0] : 'לא ידוע';
        
        methods.setError('effectiveDate', {
          type: 'manual',
          message: `שגיאה: תאריך התחולה ${conflictingDate} כבר קיים. אנא בחר תאריך אחר, או עדכן את הרשומה הקיימת.`,
        });
      } else if (errorMessage.includes('תאריך תחילה') || errorMessage.includes('effectiveDate')) {
        methods.setError('effectiveDate', {
          type: 'manual',
          message: errorMessage,
        });
      } else {
        console.error('שגיאה בשמירה', errorMessage);
        alert(`שגיאה בשמירה: ${errorMessage}`);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-4 p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">
          {initialData ? 'עדכון תמחור לחדר ישיבות' : 'יצירת תמחור חדש לחדר ישיבות'}
        </h3>
        

        <NumberInputField 
          name="hourlyRate" 
          label="תעריף לשעה" 
          required 
          min={0}  
        />
        <NumberInputField 
          name="discountedHourlyRate" 
          label="תעריף מוזל (4+ שעות)" 
          required 
          min={0} 
        />
        <NumberInputField 
          name="freeHoursKlikahCard" 
          label="שעות חינם (כרטיס קליקה)" 
          required 
          min={0} 
        />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">תאריך תחולה</label>
          <input
            type="date"
            {...methods.register('effectiveDate', { 
                required: 'תאריך תחולה הוא שדה חובה', 
                validate: {
                    futureDate: (value) => {
                        if (initialData) { 
                            return true;
                        }
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); 
                        const selectedDate = new Date(value);
                        selectedDate.setHours(0, 0, 0, 0);

                        return selectedDate >= today || 'תאריך תוקף חייב להיות מהיום והלאה';
                    }
                }
            })}
            className="border px-3 py-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
            disabled={!!initialData} 
          />
          {methods.formState.errors.effectiveDate && (
            <p className="text-red-500 text-sm">{methods.formState.errors.effectiveDate.message}</p>
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
          שמור
        </button>
      </form>
    </FormProvider>
  );
};

export default MeetingRoomPricingForm;