import { z } from "zod";

/**
 * Shared strong password validation schema.
 * Rules: min 8, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character.
 */
export const passwordSchema = z
  .string()
  .min(8, { message: "Mật khẩu phải chứa ít nhất 8 ký tự." })
  .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ in hoa." })
  .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ thường." })
  .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ số." })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.",
  });
