// import React from "react";
// import clsx from "clsx";
// import { useTheme } from "../themeConfig";

// export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string; //מה שיהיה מעל הINPUT 
//   error?: string; //הודענ אם משהו לא תקין 
//   required?: boolean; //אם הדברים הם חובה 
//   dir?: 'rtl' | 'ltr';
//   className?: string;
//   'data-testid'?: string;
// }

// export const Input: React.FC<InputProps> = ({
//   label,
//   error,
//   required,
//   dir,
//   className,
//   'data-testid': testId,
//   // זה כל בבגדרות בחשובות 
//   ...props //זה כל שער ההגדרות שנשתמש בהם בהמשך אבל לא עיקריות 
// }) => {
//   const theme = useTheme();
//   const effectiveDir = dir || theme.direction;

//   return (
//     <div className="space-y-1" dir={effectiveDir}> 
//     {/* // מוסיף מקום בין האלאמטים CHILDREN */}
//       <label className="block text-sm font-medium">
//         {label} 
//         {/* //איפה שהדברים יהו כתובים  */}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <input
//         data-testid={testId}
//        className={clsx(
//         "w-full px-3 py-2 text-sm sm:text-base border rounded focus:outline-none focus:ring-2",
//           error
//             ? "border-red-500 focus:ring-red-300"
//             : "border-gray-300 focus:ring-blue-300",
//           className
//         )} 
//         //פה מגדירים את הSTYLE תלוי במה שמכניסים 
//         aria-invalid={!!error}
//         aria-required={required}
//         aria-label={label}
//     //את הARIA משתמשים לאנשים עם מוגבלות כל פעם שיש לי ERROR אז מראה לי את זה בצורה שיהיה להם קל לזהותו 
//         {...props}
//       />
//       {error && <p className="text-sm text-red-600">{error}</p>}
//       {/* // אם יש ERROR אז מראה את זה מתחט לTEXT  */}
//     </div>
//   );
// };

import React from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { useTheme } from "../themeConfig";

interface InputFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  dir?: 'rtl' | 'ltr';
  className?: string;
  "data-testid"?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  required,
  disabled,
  dir,
  className,
  "data-testid": testId,
}) => {
  const theme = useTheme();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;
  const effectiveDir = dir || theme.direction;

  return (
    <div className="space-y-1 w-full" dir={effectiveDir}>
      <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: theme.typography.fontFamily.hebrew }}>
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-label={label}
        data-testid={testId}
        className={clsx(
          "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition",
          error
            ? `border-[${theme.colors.semantic.error}] focus:ring-[${theme.colors.semantic.error}]`
            : `border-gray-300 focus:ring-[${theme.colors.primary}]`,
          className
        )}
        style={{
          fontFamily:
            effectiveDir === "rtl"
              ? theme.typography.fontFamily.hebrew
              : theme.typography.fontFamily.latin,
        }}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
//הסבר מפורש בבקומפוננטה של הFORM---הכל כמעט אותו דבר, אם יש שאלות אפשר לבדוק שם 