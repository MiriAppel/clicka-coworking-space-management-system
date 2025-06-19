import React from "react";
import { useFormContext } from "react-hook-form";
//נותן להיכנס לכל מקום לטפסים שנמצאים בתוך הFORMPROVIDER 
import clsx from "clsx";
import { useTheme } from "../themeConfig";

interface CheckboxFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  dir?: 'rtl' | 'ltr';
  className?: string;
  "data-testid"?: string;
  //מקבל את כל הדברים שהטופס צריך לקבל 
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  required,
  disabled,
  dir,
  className,
  "data-testid": testId,
  //הגדרת הקומפוננטה ושימוש בPROPS 
}) => {
  const theme = useTheme();
  const {
    register,
    formState: { errors },
  } = useFormContext();
//נכנס לתוך הAPI של REACT-HOOK-FORM  כדי שהוא יביא לי את השגיעות 
  const error = errors[name]?.message as string | undefined;
  //מחפש אם קיים הידעה של שגיעה 
  const effectiveDir = dir || theme.direction;

  return (
    <div className="flex items-center space-x-2" dir={effectiveDir}>
      <input
        type="checkbox"
        {...register(name)} 
        //מקשר את זה עוד פעם עם REACT-HOOK כדי לטפל בולידציה והססטוס 
        //משתמשים בזה במקום הUSESTATE 
        //לודגמא מה שאני עושה בCHECKBOX נשאר שמור בתוכו בלע צורך לעשות משתנה חדש 
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-label={label}
        data-testid={testId}
        className={clsx(
          "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2",
          className
        )}
      />
      <label className="text-sm text-gray-700" style={{ fontFamily: theme.typography.fontFamily.hebrew }}>
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
