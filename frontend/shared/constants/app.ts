export const APP_SAVE_KEY = (() => {
  const prefix = process.env.NEXT_PUBLIC_APP_NAME ?? "tutor-app";
  return {
    LOCALE: `${prefix}::locale`,
    TOKEN_KEY: `${prefix}::token_key`,
    REFRESH_TOKEN_KEY: `${prefix}::refresh_token_key`,
    USER_ROLE: `${prefix}::user_role`,
    LOGIN_STATUS: `${prefix}::login_status`,
  };
})();

const FULL_PAGE_ROUTES = [
  "/login",
  "/signup/parent",
  "/signup/tutor",
  "/forgot-password",
  "/reset-password",
];
export const NO_NAVBAR_ROUTES = FULL_PAGE_ROUTES;
export const NO_FOOTER_ROUTES = FULL_PAGE_ROUTES;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER_PARENT: "/signup/parent",
  REGISTER_TUTOR: "/signup/tutor",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  PARENT: {
    DASHBOARD: "/dashboard/parent/overview",
    CHILDREN: "/dashboard/parent/children",
    COURSES: "/dashboard/parent/courses",
    REQUESTS: "/dashboard/parent/requests",
    SCHEDULES: "/dashboard/parent/schedules",
    NOTIFICATIONS: "/dashboard/parent/notifications",
  },
  TUTOR: {
    DASHBOARD: "/dashboard/tutor/overview",
    PROFILE: "/dashboard/tutor/profile",
    SUBJECTS: "/dashboard/tutor/subjects",
    AVAILABILITY: "/dashboard/tutor/availability",
    SCHEDULE: "/dashboard/tutor/schedule",
    MARKETPLACE: "/dashboard/tutor/marketplace",
    REVIEWS: "/dashboard/tutor/reviews",
    NOTIFICATIONS: "/dashboard/tutor/notifications",
  },
  ADMIN: {
    DASHBOARD: "/dashboard/admin/statistical",
    TUTOR_APPROVAL: "/dashboard/admin/tutor-approval",
    USERS: "/dashboard/admin/users",
    SUBJECTS: "/dashboard/admin/subjects",
    NOTIFICATIONS: "/dashboard/admin/notifications",
  },
};
