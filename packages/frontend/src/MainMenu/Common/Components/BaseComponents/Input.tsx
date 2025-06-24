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
    type?: React.HTMLInputTypeAttribute;
    // defaultValue?: string | number;
    placeholder?: string;
    multiple?:boolean
  }
  export const InputField: React.FC<InputFieldProps> = ({
    name,
    label,
    required,
    disabled,
    dir,
    className,
    "data-testid": testId,
    type = "text",
    // defaultValue,
    placeholder,
    multiple
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
          type={type || "text"}
          // defaultValue={defaultValue}
          placeholder={placeholder}
          multiple={multiple && type === "file"} //אם לא אומרים לו על הTYPE הוא לא יהיה יעיל ולא יעלה גלום רק מתי שאומרים לו שהוא מסוג הזה אז מעלה את כל הFILE
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