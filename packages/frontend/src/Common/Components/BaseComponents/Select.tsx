import { useFormContext } from "react-hook-form";
import { useTheme } from "../themeConfig";
import clsx from "clsx";

interface SelectFieldProps {
  name: string;
  label: string;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  dir?: "rtl" | "ltr";
  className?: string;
  "data-testid"?: string;
  value?: string;  // להוסיף את הפרופס האלו
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  required,
  disabled,
  dir,
  className,
  "data-testid": testId,
  value,
  onChange,
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

      <select
        {...(value !== undefined && onChange
          ? { value, onChange }
          : register(name))}
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
      >
        <option value="">{effectiveDir === "rtl" ? "בחר אפשרות" : "Select an option"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p
          className="text-sm text-red-600"
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          {error}
        </p>
      )}
    </div>
  );
};
