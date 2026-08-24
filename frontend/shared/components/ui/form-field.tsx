import React from "react"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"

interface FormFieldProps extends React.ComponentPropsWithoutRef<typeof Input> {
  label: string
  error?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
}

const FormField = React.forwardRef<React.ElementRef<typeof Input>, FormFieldProps>(
  ({ label, error, leftIcon, rightElement, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground/80">{label}</label>
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </span>
          )}
          <Input
            ref={ref}
            className={cn(
              leftIcon ? "pl-10" : undefined,
              rightElement ? "pr-10" : undefined,
              error
                ? "border-red-400 focus-visible:ring-red-400/30 focus-visible:border-red-400"
                : undefined,
              className
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightElement}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField }
