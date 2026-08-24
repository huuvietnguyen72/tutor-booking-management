import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_SAVE_KEY, ROUTES } from "./shared/constants/app";

/**
 * Next.js 16 Proxy function (formerly Middleware)
 * Handles role-based access control and route protection.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(APP_SAVE_KEY.TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = [
    "/login",
    "/signup/parent",
    "/signup/tutor",
    "/forgot-password",
    "/reset-password",
  ];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is logged in
  if (token) {
    const roleCookie = request.cookies.get(APP_SAVE_KEY.USER_ROLE)?.value || "";
    const role = roleCookie.toUpperCase();

    // 1. Prevent access to auth routes - Redirect to their specific dashboard
    if (isAuthRoute) {
      if (role === "PARENT") {
        return NextResponse.redirect(
          new URL(ROUTES.PARENT.DASHBOARD, request.url),
        );
      } else if (role === "TUTOR") {
        return NextResponse.redirect(
          new URL(ROUTES.TUTOR.DASHBOARD, request.url),
        );
      } else if (role === "ADMIN") {
        return NextResponse.redirect(
          new URL(ROUTES.ADMIN.DASHBOARD, request.url),
        );
      } else {
        return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
      }
    }

    // 2. Prevent Tutors from accessing tutor search/booking flow
    if (pathname.startsWith("/tutor") && role === "TUTOR") {
      const url = new URL(ROUTES.TUTOR.DASHBOARD, request.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // 3. Prevent accessing other role's dashboard
    const roleRedirects: Record<string, string> = {
      ADMIN: ROUTES.ADMIN.DASHBOARD,
      TUTOR: ROUTES.TUTOR.DASHBOARD,
      PARENT: ROUTES.PARENT.DASHBOARD,
    };

    const dashboardMatch = pathname.match(/^\/dashboard\/(admin|tutor|parent)/);
    if (dashboardMatch) {
      const targetRole = dashboardMatch[1].toUpperCase();
      if (role !== targetRole) {
        const url = new URL(roleRedirects[role] || "/", request.url);
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }
    }
  } else {
    // 3. Unauthenticated users should not access protected routes
    const protectedPrefixes = ["/dashboard", "/profile", "/change-password"];
    const isProtectedRoute =
      protectedPrefixes.some((route) => pathname.startsWith(route)) ||
      (pathname.startsWith("/tutor/") && pathname.endsWith("/booking"));

    if (isProtectedRoute) {
      const url = new URL(ROUTES.LOGIN, request.url);
      url.searchParams.set("error", "unauthenticated");
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)",
  ],
};
