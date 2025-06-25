import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerStatus, ExitReason } from 'shared-types';

interface Props {
  open: boolean;
  onClose: () => void;
  customerId: string;
}

const schema = z.object({
  status: z.nativeEnum(CustomerStatus),
  effectiveDate: z.string().min(1, "חובה לבחור תאריך"),
  notifyCustomer: z.boolean(),
  reason: z.string().optional(),
  exitNoticeDate: z.string().optional(),
  plannedExitDate: z.string().optional(),
  exitReason: z.nativeEnum(ExitReason).optional(),
  exitReasonDetails: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.status === CustomerStatus.NOTICE_GIVEN) {
    if (!data.exitNoticeDate) {
      ctx.addIssue({
        path: ['exitNoticeDate'],
        code: z.ZodIssueCode.custom,
        message: "יש להזין תאריך הודעת עזיבה"
      });
    }
    if (!data.plannedExitDate) {
      ctx.addIssue({
        path: ['plannedExitDate'],
        code: z.ZodIssueCode.custom,
        message: "יש להזין תאריך עזיבה מתוכנן"
      });
    }
    if (!data.exitReason) {
      ctx.addIssue({
        path: ['exitReason'],
        code: z.ZodIssueCode.custom,
        message: "יש לבחור סיבת עזיבה"
      });
    }
  }
});

const statusLabels: Record<CustomerStatus, string> = {
  ACTIVE: "פעיל",
  NOTICE_GIVEN: "הודעת עזיבה",
  EXITED: "עזב",
  PENDING: "בהמתנה"
};

const reasonLabels: Record<ExitReason, string> = {
  RELOCATION : 'מעבר למיקום אחר',
  BUSINESS_CLOSED : 'סגירת עסק',
  PRICE : 'מחיר',
  WORK_FROM_HOME : 'עבודה מהבית',
  SPACE_NEEDS : 'צרכי חלל',
  DISSATISFACTION : 'חוסר שביעות רצון',
  OTHER: 'אחר'
};


type FormData = z.infer<typeof schema>;
export const CustomerStatusChanged: React.FC<Props> = ({ open, onClose, customerId }) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      status: CustomerStatus.ACTIVE,
      notifyCustomer: false
    }
  });

  const selectedStatus = watch('status');

  // ✅ כאן צריך להוסיף קריאת API בפועל – שליחת שינוי סטטוס לשרת
  const onSubmit = async (data: FormData) => {
    console.log("שליחה:", data);

    try {
      // ✳️ כאן צריכה לבוא קריאה לשרת (POST או PUT)
      // לדוגמה:
      // await customerApi.changeCustomerStatus(customerId, data);

      // אם מדובר ב־NOTICE_GIVEN, צריכה לבוא גם קריאה ל־recordExitNotice

      alert("הטופס נשלח בהצלחה");
      onClose();
    } catch (error) {
      console.error("שגיאה בשליחה לשרת", error);
      alert("שגיאה בשליחת הטופס לשרת");
    }
  };

  if (!open) return null;

  return (
    <div>
      <h2>שינוי סטטוס לקוח</h2>
      <form onSubmit={handleSubmit(onSubmit)} dir="rtl">

        <div>
          <label>סטטוס חדש:</label>
          <select {...register("status")}>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {errors.status && <p style={{ color: 'red' }}>{errors.status.message}</p>}
        </div>

        <div>
          <label>תאריך שינוי:</label>
          <input type="date" {...register("effectiveDate")} />
          {errors.effectiveDate && <p style={{ color: "red" }}>{errors.effectiveDate.message}</p>}
        </div>

        <div>
          <label>סיבת שינוי:</label>
          <textarea {...register("reason")} />
        </div>

        <div>
          <label>
            <input type="checkbox" {...register("notifyCustomer")} />
            שלח התראה ללקוח
          </label>
        </div>

        {selectedStatus === CustomerStatus.NOTICE_GIVEN && (
          <div style={{ border: '1px solid gray', padding: '10px', marginTop: '10px' }}>
            <h3>פרטי עזיבה</h3>

            <div>
              <label>תאריך הודעת יציאה:</label>
              <input type="date" {...register("exitNoticeDate")} />
            </div>

            <div>
              <label>תאריך עזיבה מתוכנן:</label>
              <input type="date" {...register("plannedExitDate")} />
            </div>
            
            <div>
              <label>סיבת עזיבה:</label>
              <select {...register("exitReason")}>
                <option value="">בחר</option>
                {Object.entries(reasonLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {errors.exitReason && <p style={{ color: 'red' }}>{errors.exitReason.message}</p>}
            </div>

            <div>
              <label>פירוט נוסף:</label>
              <textarea {...register("exitReasonDetails")} />
            </div>
          </div>
        )}

        <br />
        <button type="submit">שמור</button>
        <button type="button" onClick={onClose} style={{ marginRight: '10px' }}>סגור</button>
      </form>
    </div>
  );
};
