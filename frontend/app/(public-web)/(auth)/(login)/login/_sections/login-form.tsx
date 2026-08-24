"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { FormField } from "@/shared/components/ui/form-field";
import { PasswordField } from "@/shared/components/ui/password-field";
import MailIcon from "@/shared/components/icons/mail-icon";
import LockOpenIcon from "@/shared/components/icons/lock-open-icon";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "@/shared/components/icons/google-icon";
import FacebookIcon from "@/shared/components/icons/facebook-icon";
import { useLogin } from "@/server/_actions/auth-action";
import { toast } from "sonner";
import { formatErrorMessage } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/constants/app";

const loginSchema = z.object({
  email: z.email({ message: "Email không hợp lệ." }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu." }),
  rememberMe: z.boolean().optional(),
});

type LoginSchema = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSocialClick?: () => void;
  onGoogleSuccess?: (token: string) => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Direct Google Identity Services (GSI) button component.
// Uses google.accounts.id API directly instead of @react-oauth/google's
// <GoogleLogin> component to prevent re-initialization on React re-renders.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
}

function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
  // Stable ref for the callback — never causes re-initialization
  const callbackRef = React.useRef(onSuccess);
  React.useEffect(() => {
    callbackRef.current = onSuccess;
  }, [onSuccess]);

  // Container ref for the Google-rendered button
  const containerRef = React.useRef<HTMLDivElement>(null);
  // Guard: only initialize once per mount
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    if (initializedRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const tryInit = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gsi = (window as any).google?.accounts?.id;
      if (!gsi || !containerRef.current) return false;

      gsi.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          if (response?.credential) {
            callbackRef.current(response.credential);
          }
        },
        auto_select: false,
      });

      gsi.renderButton(containerRef.current, {
        type: "standard",
        size: "large",
        theme: "outline",
        text: "signin_with",
        shape: "rectangular",
        width: 300,
      });

      initializedRef.current = true;
      return true;
    };

    // If GSI script is already loaded (from GoogleOAuthProvider), init immediately.
    // Otherwise poll until it's available.
    if (!tryInit()) {
      const interval = setInterval(() => {
        if (tryInit()) clearInterval(interval);
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  // Cleanup on unmount so it can re-initialize if component remounts
  React.useEffect(() => {
    return () => {
      initializedRef.current = false;
    };
  }, []);

  return (
    <div className="relative z-0 isolate w-full h-11 overflow-hidden rounded-xl border border-input group">
      {/* Google SDK renders its own iframe button here — positioned on top, invisible */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 flex items-center justify-center opacity-[0.011] pointer-events-auto cursor-pointer [&_iframe]{width:100%!important;height:100%!important}"
        style={{ minWidth: 300 }}
      />
      {/* Visual button underneath — pointer-events-none so clicks pass through */}
      <div
        aria-hidden="true"
        className="flex items-center justify-center gap-2 h-full w-full px-4 bg-card group-hover:bg-accent group-hover:text-accent-foreground transition-all font-medium text-sm text-foreground pointer-events-none"
      >
        <GoogleIcon className="w-5 h-5" />
        <span>Google</span>
      </div>
    </div>
  );
}

// Wrap in React.memo — this component should NEVER re-render
const StableGoogleSignInButton = React.memo(GoogleSignInButton);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function LoginForm({ onSocialClick, onGoogleSuccess }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleGoogleSuccess = React.useCallback(
    (credential: string) => {
      if (onGoogleSuccess) {
        onGoogleSuccess(credential);
      }
    },
    [onGoogleSuccess],
  );

  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthenticated") {
      toast.error("Vui lòng đăng nhập để tiếp tục.");

      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      const queryString = params.toString();
      const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  function onSubmit(values: LoginSchema) {
    const toastId = toast.loading("Đang xác nhận thông tin đăng nhập...");
    login(values, {
      onSuccess: (data) => {
        toast.success("Đăng nhập thành công!", { id: toastId });
        router.refresh();
        
        // Điều hướng dựa trên role
        const roleRedirects: Record<string, string> = {
          ADMIN: ROUTES.ADMIN.DASHBOARD,
          TUTOR: ROUTES.TUTOR.DASHBOARD,
          PARENT: ROUTES.PARENT.DASHBOARD,
        };

        const redirectPath = data.role ? roleRedirects[data.role] || callbackUrl : callbackUrl;
        router.push(redirectPath);
      },
      onError: (error) => {
        toast.error(
          formatErrorMessage(error, "Email hoặc mật khẩu không chính xác."),
          { id: toastId }
        );
      },
    });
  }

  return (
    <div className="w-full">
      {/* Icon & Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-8">
        <Link
          href="/"
          prefetch={false}
          className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 cursor-pointer transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 hover:scale-105"
        >
          <LockOpenIcon strokeWidth={2.5} />
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Chào mừng trở lại
          </h1>
          <p className="text-sm text-muted-foreground">
            Vui lòng đăng nhập vào tài khoản của bạn
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label="Email"
          type="email"
          placeholder="username@email.com"
          leftIcon={<MailIcon className="text-muted-foreground" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordField
          label="Mật khẩu"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-4 h-4 rounded border border-input group-hover:border-blue-400 transition-colors">
              <input
                type="checkbox"
                className="peer absolute inset-0 opacity-0 cursor-pointer"
                {...register("rememberMe")}
              />
              <div className="w-2 h-2 bg-blue-600 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-200" />
            </div>
            <span className="text-sm text-muted-foreground select-none">
              Ghi nhớ
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
          disabled={isPending}
        >
          {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      {/* Social Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-medium tracking-wider">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <StableGoogleSignInButton onSuccess={handleGoogleSuccess} />
        <button
          type="button"
          onClick={onSocialClick}
          className="relative z-20 flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-input bg-card hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98] font-medium text-sm text-foreground"
        >
          <FacebookIcon className="w-5 h-5" />
          <span>Facebook</span>
        </button>
      </div>

      {/* Register Footer */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        Bạn chưa có tài khoản?{" "}
        <Link
          href="/signup/parent"
          className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
