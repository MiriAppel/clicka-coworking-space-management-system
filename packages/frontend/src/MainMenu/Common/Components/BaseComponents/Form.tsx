import React from "react";
import clsx from "clsx";
import { useTheme } from "../themeConfig";
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  dir?: "rtl" | "ltr";
  className?: string; //כדי להוסיך עיצובים בקומפוממטת הבן
  "data-testid"?: string; //  בלי טעויות הוספה אופציונלית: כדי לאתר אותו יותר בקלות וביעילות
}
export const Form: React.FC<FormProps> = ({
  children,
  className,
  dir,
  "data-testid": testId,
  ...props
}) => {
  const theme = useTheme();
  const effectiveDir = dir || theme.direction;
  return (
    <form
      dir={effectiveDir}
      data-testid={testId}
      className={clsx(
        "space-y-4 p-4 rounded shadow-md",
        effectiveDir === "rtl" ? "text-right" : "text-left",
        className
      )}
      style={{
    //   backgroundColor: color,
      fontFamily:
        effectiveDir === "rtl"
          ? theme.typography.fontFamily.hebrew
          : theme.typography.fontFamily.latin,
    }}
      {...props}
    >
      {children}
    </form>
  );
};

