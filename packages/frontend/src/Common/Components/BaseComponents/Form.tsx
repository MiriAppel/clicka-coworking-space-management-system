import React from "react";
import clsx from "clsx";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
//מייבים את ZOD כדי שנוכל להשתמש בולידציות בהמשך הקוד 
import { useTheme } from "../themeConfig";
import { useTranslation } from "react-i18next";
//מגדירים את ז ה לתרגום הFORM 

// import { AlertCircle } from "lucide-react"; // 
export interface BaseComponentProps {
  className?: string;
  dir?: "rtl" | "ltr";
  "data-testid"?: string;
  children?: React.ReactNode;
}

export interface FormComponentProps<T extends FieldValues>
  extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  schema?: ZodType<T>; //סכמה לולידציות של FORM 
  onSubmit: SubmitHandler<T>;//פונקציה להפעלה בשליחת הטופס 
  methods?: UseFormReturn<T>;
}


export function Form<T extends FieldValues>({
  //מגדירים אותו גנרי כדי שנוכל להשתמש בו עם כל מיני טיפוסים כמו USER,PRODUCT וכו 
  label,
  schema,
  onSubmit,
  className,
  dir,
  "data-testid": testId,
  children,
  methods: externalMethods,
}: FormComponentProps<T>) {
  const {theme} = useTheme();
  const { t } = useTranslation();
  //שימוש לתירגום עם I18NEXT לפי הנדרש 

  const effectiveDir = dir || theme.direction;
  
  const internalMethods = useForm<T>({
    ...(schema ? { resolver: zodResolver(schema) } : {}),
    mode: "onSubmit",
  });
  const methods: UseFormReturn<T> = externalMethods ?? internalMethods;
    //מתי שלוחצים על הONSUBMIT אז ישר בודק לי את הולידציה של הטופס בזכות הZOD 
    
  
  

  return (
    <FormProvider {...methods}>
       {/* //משתמשים בזה כדי שנוכל להשתמש ולהכניס לפה את הקומפוננטות האחרות שגם כן קשורות לטופס וזה עוזר כדי שלא נצטרך להעתיק את כל הPROPS  */}
      <form
        dir={effectiveDir}
        data-testid={testId}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={clsx(
          "grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded shadow-md w-full max-w-4xl",
          effectiveDir === "rtl" ? "text-right" : "text-left",
          className
        )}
        style={{
          fontFamily:
            effectiveDir === "rtl"
              ? theme.typography.fontFamily.hebrew
              : theme.typography.fontFamily.latin,
        }}
        role="form"
        aria-label={label ? t(label) : undefined} //  ומשתמש בשפה הנדרשת שיקרא את הכותרת של הטופס 
      >
      
       {label && (
    <h2
  className="text-xl font-semibold mb-4 col-span-full"
  style={{
    color: theme.colors.primary,  
  }}
  tabIndex={-1}  
   >
  {t(label)}
  {/* //שימוד בשפה נדרשת לפי הI18NEXT */}
    </h2>
     )}
        
        {methods.formState.errors.root && (
          <div
  className="text-red-600 text-sm mb-2 col-span-full"  // COL-SPAN-כדי שכל הרוחב יהיה בשימוש 
  role="alert"
  aria-live="assertive"
  // כל פעם שיש שגיעה מייד קורא אותה ומעדכן עליה כדי שיוכל לתקן אותה באופן מיידי 
  tabIndex={-1}  
  style={{
    color: theme.colors.semantic.error,  // שימוש בקומפוננטת בסיס THEMECONFIG למתי שיהיה שגיעה יביא אותה בצבע הנדרש
  }}
   >
  {methods.formState.errors.root.message}
   </div>
        )}

        {/* <Input name="email" label="Email" />
      <Checkbox name="accept" label="Acepto los términos" /> */}
      {/* //דוגמא לשימוש של הקומפוננטות האחרות */}
        {children}
      </form>
    </FormProvider>
  );
}