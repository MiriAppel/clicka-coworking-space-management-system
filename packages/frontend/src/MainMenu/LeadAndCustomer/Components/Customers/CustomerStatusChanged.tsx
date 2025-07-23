// CustomerStatusChanged.tsx
import { useParams, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerStatus, ExitReason } from 'shared-types';
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { CheckboxField } from '../../../../Common/Components/BaseComponents/CheckBox';
import { useCustomerFormData } from '../../Hooks/useCustomerFormData';
import {
  getCustomerById,
  patchCustomer,
  recordExitNotice,
} from "../../../../Services/LeadAndCustomersService";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   customerId: string;
// }

const schema = z
  .object({
    status: z.nativeEnum(CustomerStatus),
    //התאריך מתעדכן אוטומטית לתאריך של היום
    // effectiveDate: z.string().min(1, 'חובה לבחור תאריך'),
    notifyCustomer: z.boolean(),
    reason: z.string().optional(),
    exitNoticeDate: z.string().optional(),
    plannedExitDate: z.string().optional(),
    exitReason: z.nativeEnum(ExitReason).optional(),
    exitReasonDetails: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    //התאריך מתעדכן אוטומטית לתאריך של היום
    if (data.status === CustomerStatus.NOTICE_GIVEN) {
      // if (!data.exitNoticeDate) {
      //   ctx.addIssue({
      //     path: ['exitNoticeDate'],
      //     code: z.ZodIssueCode.custom,
      //     message: 'יש להזין תאריך הודעת עזיבה',
      //   });
      // }
      if (!data.plannedExitDate) {
        ctx.addIssue({
          path: ['plannedExitDate'],
          code: z.ZodIssueCode.custom,
          message: 'יש להזין תאריך עזיבה מתוכנן',
        });
      }
      if (!data.exitReason) {
        ctx.addIssue({
          path: ['exitReason'],
          code: z.ZodIssueCode.custom,
          message: 'יש לבחור סיבת עזיבה',
        });
      }
    }
  });

type FormData = z.infer<typeof schema>;

const statusLabels: Record<CustomerStatus, string> = {
  ACTIVE: 'פעיל',
  NOTICE_GIVEN: 'הודעת עזיבה',
  EXITED: 'עזב',
  PENDING: 'בהמתנה',
};

const reasonLabels: Record<ExitReason, string> = {
  RELOCATION: 'מעבר למיקום אחר',
  BUSINESS_CLOSED: 'סגירת עסק',
  PRICE: 'מחיר',
  WORK_FROM_HOME: 'עבודה מהבית',
  SPACE_NEEDS: 'צרכי חלל',
  DISSATISFACTION: 'חוסר שביעות רצון',
  OTHER: 'אחר',
};

export const CustomerStatusChanged: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  
  //  if (!customerId) return null;
  const handleClose = () => navigate(-1);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      status: CustomerStatus.ACTIVE,
      notifyCustomer: false,
      // effectiveDate: '',
      reason: '',
      exitNoticeDate: '',
      plannedExitDate: '',
      exitReason: undefined,
      exitReasonDetails: '',
    },
  });

  const selectedStatus = methods.watch('status');

  const fetchCustomerData = useCallback(async (id: string) => {
      const customer = await getCustomerById(id);
      const latestPeriod = customer.periods?.[0];

      return {
        status: customer.status,
        // effectiveDate: customer.billingStartDate ?? '',
        notifyCustomer: false,
        reason: '',
        exitNoticeDate: latestPeriod?.exitNoticeDate ?? '',
        plannedExitDate: latestPeriod?.exitDate ?? '',
        exitReason: latestPeriod?.exitReason,
        exitReasonDetails: latestPeriod?.exitReasonDetails ?? '',
      };
    },
[]);
  useCustomerFormData({
    open: !!customerId,
    customerId: customerId ?? "",
    methods,
    fetchCustomerData
    ,
  });

    if (!customerId) return null;

  const onSubmit = async (data: FormData) => {
    console.log("data in submit", data);
    
  try {
    // 1. אם מדובר בעזיבה – קודם נקליט את פרטי העזיבה
    if (data.status === CustomerStatus.NOTICE_GIVEN) {
      await recordExitNotice(customerId, {
        exitNoticeDate: data.exitNoticeDate!,
        plannedExitDate: data.plannedExitDate!,
        exitReason: data.exitReason!,
        exitReasonDetails: data.exitReasonDetails,
      });
    }
    // 2. שולחים את עדכון הלקוח
    await patchCustomer(customerId, {
      status: data.status,
      notes: data.exitReasonDetails,
      ...(data.reason && { reason: data.reason }),
    });
    // סגירה
    navigate(-1);
  } catch (error) {
    console.error('שגיאה בעדכון לקוח:', error);
  }
};

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-4">שינוי סטטוס לקוח</h2>

      <Form
        schema={schema}
        onSubmit={onSubmit}
        methods={methods}
        label="עדכון סטטוס"
        className="space-y-4"
      >
        <SelectField
          name="status"
          label="סטטוס חדש"
          options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
          required
        />

        {/* <InputField name="effectiveDate" label="תאריך שינוי" type="date" required /> */}
        <InputField name="reason" label="סיבת שינוי" />
        <CheckboxField name="notifyCustomer" label="שלח התראה ללקוח" />

        {selectedStatus === CustomerStatus.NOTICE_GIVEN && (
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-2">פרטי עזיבה</h3>

            <InputField name="exitNoticeDate" label="תאריך הודעת עזיבה" type="date" required />
            <InputField name="plannedExitDate" label="תאריך עזיבה מתוכנן" type="date" required />

            <SelectField
              name="exitReason"
              label="סיבת עזיבה"
              options={Object.entries(reasonLabels).map(([value, label]) => ({ value, label }))}
              required
            />

            <InputField name="exitReasonDetails" label="פירוט נוסף" />
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button type="button" variant="secondary" onClick={handleClose}>
            סגור
          </Button>
          <Button type="submit" variant="primary">
            שמור
          </Button>
        </div>
      </Form>
    </div>
  );
};
