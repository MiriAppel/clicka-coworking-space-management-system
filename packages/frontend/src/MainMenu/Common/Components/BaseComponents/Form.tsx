
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
import { useTheme } from "../themeConfig";
import { useTranslation } from "react-i18next";

// Props base comunes
export interface BaseComponentProps {
  className?: string;
  dir?: "rtl" | "ltr";
  "data-testid"?: string;
  children?: React.ReactNode;
}

// Props del componente Form
export interface FormComponentProps<T extends FieldValues>
  extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  methods?: UseFormReturn<T>;
  schema?: ZodType<T>; // ← ahora opcional
  onSubmit: SubmitHandler<T>;
}

// Componente Form
export function Form<T extends FieldValues>({
  label,
  schema,
  onSubmit,
  methods: externalMethods,
  className,
  dir,
  "data-testid": testId,
  children,
}: FormComponentProps<T>) {
  const theme = useTheme();
  const { t } = useTranslation();
  const effectiveDir = dir || theme.direction;

  // Configurar useForm con o sin schema
  const internalMethods = useForm<T>({
    ...(schema ? { resolver: zodResolver(schema) } : {}),
    mode: "onSubmit",
  });
  const methods: UseFormReturn<T> = externalMethods ?? internalMethods;

  return (
    <FormProvider {...methods}>
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
        aria-label={label ? t(label) : undefined}
      >
        {/* Encabezado solo si hay label */}
        {label && <h2 className="text-xl font-semibold mb-4">{t(label)}</h2>}

        {/* Errores generales del formulario */}
        {methods.formState.errors.root && (
          <div
            className="text-red-600 text-sm mb-2"
            role="alert"
            aria-live="assertive"
          >
            {methods.formState.errors.root.message}
          </div>
        )}

        {/* Elementos hijos del formulario */}
        {children}
      </form>
    </FormProvider>
  );
}
