import React, { useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash, Mail, Phone, Building2, BadgePercent } from "lucide-react";
import { CustomerStatus } from "shared-types";
import { Button } from "./Button";

export interface CustomerCardProps {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  businessType: string;
  status: CustomerStatus;
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

export const ExpandableCustomerCard = ({
  id,
  name,
  phone,
  email,
  businessName,
  businessType,
  status,
  onEdit,
  onDelete,
}: CustomerCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border shadow p-4 mb-4 bg-white transition-all duration-300">
      {/* Header row */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="font-bold text-lg">{name}</div>
            <div className={`text-sm px-2 py-1 rounded-xl font-semibold ${statusColors[status]}`}>
              {statusLabels[status]}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Mail size={14} /> <span>{email}</span>
          </div>
        </div>
        {open ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
      </div>

      {/* Expanded section */}
      {open && (
        <div className="mt-4 border-t pt-4 grid gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Phone size={14} /> <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={14} /> <span>{businessName}</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgePercent size={14} /> <span>{businessType}</span>
          </div>

          {/* פעולה */}
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="secondary" onClick={() => onEdit(id)} className="flex gap-1 items-center">
              <Pencil size={14} /> עריכה
            </Button>
            <Button size="sm" variant="accent" onClick={() => onDelete(id)} className="flex gap-1 items-center">
              <Trash size={14} /> מחיקה
            </Button>
          </div>

          {/* כאן אפשר להוסיף חוזה/כסף/מידע נוסף */}
          <div className="mt-3 border-t pt-3 text-xs text-gray-500 italic">
            {/* זה מקום להכניס טאב, קישורים, סכומים וכו' */}
            כאן תופיע תצוגת חוזה / תשלומים / מסמכים
          </div>
        </div>
      )}
    </div>
  );
};
