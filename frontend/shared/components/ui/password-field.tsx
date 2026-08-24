"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "@/shared/components/ui/form-field";
import LockIcon from "@/shared/components/icons/lock-icon";

interface PasswordFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export const PasswordField = React.forwardRef<
  HTMLInputElement,
  PasswordFieldProps
>(({ label, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      label={label}
      type={showPassword ? "text" : "password"}
      placeholder="********"
      leftIcon={<LockIcon className="text-gray-400" />}
      rightElement={
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      error={error}
      ref={ref}
      {...props}
    />
  );
});

PasswordField.displayName = "PasswordField";
