'use client'

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({
  label,
  error,
  required,
  children,
  className,
  ...props
}: FormFieldProps) {
  const id = React.useId()

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Label
        htmlFor={id}
        className="flex items-center gap-1"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {React.isValidElement(children) &&
        React.cloneElement(children, {
          id,
          "aria-describedby": error ? `${id}-error` : undefined,
          "aria-invalid": error ? true : undefined,
        })
      }
      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  )
} 