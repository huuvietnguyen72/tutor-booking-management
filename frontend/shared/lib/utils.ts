import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge Tailwind CSS class names, resolving conflicts intelligently. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Remove technical prefix from API errors to make messages user-friendly. */
export function sanitizeApiErrorMessage(message: string): string {
  if (!message) return "";
  return message
    .replace(/^\s*system error\s*:?\s*/i, "")
    .trim();
}

/** 
 * Map of technical error messages to user-friendly Vietnamese translations.
 */
const ERROR_MESSAGE_MAP: Record<string, string> = {
  "bad credentials": "Email hoặc mật khẩu không chính xác.",
  "user is disabled": "Tài khoản của bạn đã bị khóa.",
  "user account is locked": "Tài khoản của bạn đã bị khóa.",
  "user not found": "Tài khoản không tồn tại.",
  "access is denied": "Bạn không có quyền thực hiện hành động này.",
  "network error": "Lỗi kết nối mạng. Vui lòng kiểm tra lại.",
};

/**
 * Extract a user-friendly error message from an API error object.
 * Strips "System error:" prefix and maps technical strings to friendly Vietnamese ones.
 */
export function formatErrorMessage(
  error: unknown,
  fallbackMessage = "Đã có lỗi xảy ra. Vui lòng thử lại."
): string {
  if (!error) return fallbackMessage;

  const err = error as { response?: { data?: { message?: string } }; message?: string };
  const rawMessage = err?.response?.data?.message ?? err?.message ?? String(error);

  if (typeof rawMessage === "string") {
    const cleanedMessage = sanitizeApiErrorMessage(rawMessage);
    if (!cleanedMessage) return fallbackMessage;
    
    // Check if we have a mapped friendly message
    const lowerMessage = cleanedMessage.toLowerCase();
    for (const [key, value] of Object.entries(ERROR_MESSAGE_MAP)) {
      if (lowerMessage.includes(key)) {
        return value;
      }
    }

    return cleanedMessage;
  }

  return fallbackMessage;
}

/**
 * Convert a Vietnamese string to a URL-safe slug.
 * Example: "Nguyễn Văn A" → "nguyen-van-a"
 */
export function toSlug(text: string): string {
  if (!text) return ""
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Check if a nav link is "active" based on the current pathname.
 * Supports prefix matching so parent routes stay active on sub-routes.
 * Example: pathname="/tutor/abc-123" with href="/tutor" → true
 */
export function isActiveLink(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

/**
 * Format a date string to a "time ago" string.
 * Example: ISO date -> "2 giờ trước"
 */
export function formatTimeAgo(dateString: string): string {
  if (!dateString) return "Mới đây";
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;

  return date.toLocaleDateString("vi-VN");
}

/**
 * Format a number to Vietnamese Currency (VNĐ).
 * Example: 500000 → "500.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format a number for price display in UI labels.
 * Example: 500000 → "500.000đ / buổi"
 */
export function formatPrice(
  amount: number | null | undefined,
  suffix = "đ",
): string {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return `0${suffix}`;
  }

  return `${new Intl.NumberFormat("vi-VN").format(Number(amount))}${suffix}`;
}

/**
 * Format a Date object to YYYY-MM-DD string in local time.
 */
export function formatToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
