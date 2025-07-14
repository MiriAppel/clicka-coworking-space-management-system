// import React, { useState } from "react";
// import { ChevronDown, ChevronUp, Pencil, Trash, Mail, Phone, Building2, BadgePercent } from "lucide-react";
// import { CustomerStatus } from "shared-types";
// import { Button } from "./Button";

// export interface CustomerCardProps {
//   id: string;
//   name: string;
//   phone: string;
//   email: string;
//   businessName: string;
//   businessType: string;
//   status: CustomerStatus;
//   onEdit: (id: string) => void;
//   onDelete: (id: string) => void;
// }

// const statusColors: Record<CustomerStatus, string> = {
//   ACTIVE: "bg-green-100 text-green-800",
//   NOTICE_GIVEN: "bg-yellow-100 text-yellow-800",
//   EXITED: "bg-red-100 text-red-800",
//   PENDING: "bg-gray-100 text-gray-800",
// };

// const statusLabels: Record<CustomerStatus, string> = {
//   ACTIVE: "פעיל",
//   NOTICE_GIVEN: "הודעת עזיבה",
//   EXITED: "עזב",
//   PENDING: "בהמתנה",
// };

// export const ExpandableCustomerCard = ({
//   id,
//   name,
//   phone,
//   email,
//   businessName,
//   businessType,
//   status,
//   onEdit,
//   onDelete,
// }: CustomerCardProps) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="rounded-xl border shadow p-4 mb-4 bg-white transition-all duration-300">
//       {/* Header row */}
//       <div
//         className="flex justify-between items-center cursor-pointer"
//         onClick={() => setOpen(!open)}
//       >
//         <div className="flex flex-col gap-1">
//           <div className="flex items-center gap-2">
//             <div className="font-bold text-lg">{name}</div>
//             <div className={`text-sm px-2 py-1 rounded-xl font-semibold ${statusColors[status]}`}>
//               {statusLabels[status]}
//             </div>
//           </div>
//           <div className="flex items-center gap-2 text-gray-600 text-sm">
//             <Mail size={14} /> <span>{email}</span>
//           </div>
//         </div>
//         {open ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
//       </div>

//       {/* Expanded section */}
//       {open && (
//         <div className="mt-4 border-t pt-4 grid gap-3 text-sm text-gray-700">
//           <div className="flex items-center gap-2">
//             <Phone size={14} /> <span>{phone}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Building2 size={14} /> <span>{businessName}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <BadgePercent size={14} /> <span>{businessType}</span>
//           </div>

//           {/* פעולה */}
//           <div className="flex gap-2 mt-2">
//             <Button size="sm" variant="secondary" onClick={() => onEdit(id)} className="flex gap-1 items-center">
//               <Pencil size={14} /> עריכה
//             </Button>
//             <Button size="sm" variant="accent" onClick={() => onDelete(id)} className="flex gap-1 items-center">
//               <Trash size={14} /> מחיקה
//             </Button>
//           </div>

//           {/* כאן אפשר להוסיף חוזה/כסף/מידע נוסף */}
//           <div className="mt-3 border-t pt-3 text-xs text-gray-500 italic">
//             {/* זה מקום להכניס טאב, קישורים, סכומים וכו' */}
//             כאן תופיע תצוגת חוזה / תשלומים / מסמכים
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };



////מעודכן כולל פרופיל

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash,
  Mail,
  Phone,
  Building2,
  IdCard,
  FileText,
  Calendar,
  ClipboardSignature,
  ScrollText,
  Coins,
  BadgePercent,
} from "lucide-react";
import { CustomerStatus, PaymentMethodType, WorkspaceType } from "shared-types";
import { Button } from "./Button";

export interface CustomerCardProps {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  businessType: string;
  status: CustomerStatus;
  idNumber?: string;
  currentWorkspaceType?: WorkspaceType;
  workspaceCount?: number;
  contractSignDate?: string;
  contractStartDate?: string;
  billingStartDate?: string;
  notes?: string;
  invoiceName?: string;
  paymentMethodType?: PaymentMethodType;
  createdAt?: string;
  updatedAt?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<CustomerStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  NOTICE_GIVEN: "bg-yellow-100 text-yellow-800",
  EXITED: "bg-red-100 text-red-800",
  PENDING: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<CustomerStatus, string> = {
  ACTIVE: "פעיל",
  NOTICE_GIVEN: "הודעת עזיבה",
  EXITED: "עזב",
  PENDING: "בהמתנה",
};

const workspaceTypeLabels: Record<WorkspaceType, string> = {
  PRIVATE_ROOM: 'חדר פרטי',
  DESK_IN_ROOM: 'שולחן בחדר',
  OPEN_SPACE: 'אופן ספייס',
  KLIKAH_CARD: 'כרטיס קליקה',
};

const paymentMethodLabels: Record<PaymentMethodType, string> = {
  CREDIT_CARD: 'כרטיס אשראי',
  BANK_TRANSFER: 'העברה בנקאית',
  CHECK: 'שיק',
  CASH: 'מזומן',
  OTHER: 'אחר',
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'לא זמין';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')
  }/${date.getFullYear().toString().slice(-2)}`;
};

export const ExpandableCustomerCard = ({
  id,
  name,
  phone,
  email,
  businessName,
  businessType,
  status,
  idNumber,
  currentWorkspaceType,
  workspaceCount,
  contractSignDate,
  contractStartDate,
  billingStartDate,
  notes,
  invoiceName,
  paymentMethodType,
  createdAt,
  updatedAt,
  onEdit,
  onDelete,
}: CustomerCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border shadow p-5 mb-4 bg-white transition-all duration-300 text-right">
  {/* Header row */}
  <div className="cursor-pointer" onClick={() => setOpen(!open)}>
    {/* שם + סטטוס */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-gray-900">{name}</div>
        <div className={`text-xs px-2 py-1 rounded-xl font-semibold ${statusColors[status]}`}>
          {statusLabels[status]}
        </div>
      </div>
      {open ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
    </div>

    {/* שורה אחת של טלפון | מייל | עסק עם רווחים */}
    <div className="mt-4 flex justify-between flex-wrap gap-y-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <Phone size={16} /> {phone}
      </div>
      <div className="flex items-center gap-2">
        <Mail size={16} /> {email}
      </div>
      <div className="flex items-center gap-2">
        <Building2 size={16} /> {businessName}
      </div>
    </div>
  </div>

  {/* Expanded section */}
  {open && (
    <div className="mt-6 border-t pt-5 grid gap-4 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <IdCard size={14} /> <span>ת"ז: {idNumber || "לא זמין"}</span>
      </div>
      <div className="flex items-center gap-2">
        <BadgePercent size={14} /> <span>תחום עיסוק: {businessType}</span>
      </div>
      <div className="flex items-center gap-2">
        <ClipboardSignature size={14} />
        <span>סוג מקום עבודה: {workspaceTypeLabels[currentWorkspaceType!] || "לא זמין"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Building2 size={14} /> <span>מספר מקומות עבודה: {workspaceCount ?? "לא זמין"}</span>
      </div>
      <div className="flex items-center gap-2">
        <ScrollText size={14} /> <span>חתימה: {formatDate(contractSignDate)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} /> <span>התחלת חוזה: {formatDate(contractStartDate)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} /> <span>תחילת חיוב: {formatDate(billingStartDate)}</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText size={14} /> <span>הערות: {notes || "אין"}</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText size={14} /> <span>חשבונית ע"ש: {invoiceName || "לא זמין"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Coins size={14} /> <span>סוג תשלום: {paymentMethodLabels[paymentMethodType!] || "לא זמין"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} /> <span>נוצר בתאריך: {formatDate(createdAt)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} /> <span>עודכן בתאריך: {formatDate(updatedAt)}</span>
      </div>

      <div className="flex gap-2 mt-4 justify-end">
        <Button size="sm" variant="secondary" onClick={() => onEdit(id)} className="flex gap-1 items-center">
          <Pencil size={14} /> עריכה
        </Button>
        <Button size="sm" variant="accent" onClick={() => onDelete(id)} className="flex gap-1 items-center">
          <Trash size={14} /> מחיקה
        </Button>
      </div>
    </div>
  )}
</div>

  );
};
