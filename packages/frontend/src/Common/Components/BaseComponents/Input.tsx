<<<<<<< HEAD
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

=======
>>>>>>> origin/Lead&Customer-UI
import React from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { useTheme } from "../themeConfig";

<<<<<<< HEAD
interface InputFieldProps {
  name: string;
=======
function getNestedError(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

interface InputFieldProps {
  name: string; 
>>>>>>> origin/Lead&Customer-UI
  label: string;
  required?: boolean;
  disabled?: boolean;
  dir?: 'rtl' | 'ltr';
  className?: string;
  "data-testid"?: string;
<<<<<<< HEAD
=======
  type?: React.HTMLInputTypeAttribute; // טיפוס של הכנסת נתונים שיעזור לנו להעלות קבצים 
  defaultValue?: string | number; //שיהיה ערך התחלתי להגדרות 
  placeholder?: string; //שיראי משהו לפני שמכניסים כיתוב 
  // multiple?: boolean; //הוספת הרבה קבצים 
>>>>>>> origin/Lead&Customer-UI
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  required,
  disabled,
  dir,
  className,
  "data-testid": testId,
<<<<<<< HEAD
}) => {
  const theme = useTheme();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;
=======
  type = "text",
  defaultValue,
  placeholder,
  // multiple,
}) => {
  const theme = useTheme();
  const {
    register, //ה מה שמקשר את הINPUT ונותן את האפשרות לעשות ולידציות, לבדוק שינויים, מכניס את זה לתוך הסובמיט 
    formState: { errors }, //מגדיר את כל השדיעות לדוג אם יש לי שגיעה בשם אז יעשה לי ERROR.NAME.MESSAGE ויזרוק את השגיעה 
    // זה השימוש של REACT-HOOK כדי שאני לא יצטרך להעביר את כל הPROPS בצורה ידיני מביא לי אותם ככה 
  } = useFormContext();

  const error = getNestedError(errors, name)?.message as string | undefined;
>>>>>>> origin/Lead&Customer-UI
  const effectiveDir = dir || theme.direction;

  return (
    <div className="space-y-1 w-full" dir={effectiveDir}>
<<<<<<< HEAD
      <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: theme.typography.fontFamily.hebrew }}>
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
=======
      <label
        className="block text-sm font-medium text-gray-700"
        style={{
          fontFamily:
            effectiveDir === "rtl"
              ? theme.typography.fontFamily.hebrew
              : theme.typography.fontFamily.latin,
        }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        //זה אופציה של HOOK שבא מחזיר את כל הPROPS הפנימיים שיש לINPUT לדוג ONCHANGE,ONBLUR ועוד  
>>>>>>> origin/Lead&Customer-UI
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-label={label}
        data-testid={testId}
<<<<<<< HEAD
=======
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        // multiple={multiple && type === "file"}
>>>>>>> origin/Lead&Customer-UI
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
<<<<<<< HEAD
      {error && <p className="text-sm text-red-600">{error}</p>}
=======
      {error && (
        <p
          className="text-sm"
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          style={{ color: theme.colors.semantic.error }}
        >
          {error}
        </p>
      )}
>>>>>>> origin/Lead&Customer-UI
    </div>
  );
};
//הסבר מפורש בבקומפוננטה של הFORM---הכל כמעט אותו דבר, אם יש שאלות אפשר לבדוק שם 