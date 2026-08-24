const ADMIN_PATHS = {
  STATS: "/admin/dashboard/stats",
  REVENUE: "/admin/dashboard/revenue",
  TOP_TUTORS: "/admin/dashboard/top-tutors",
  PENDING_TUTORS: "/admin/tutors/pending",
  APPROVE_TUTOR: (id: number) => `/admin/tutors/${id}/approve`,
  REJECT_TUTOR: (id: number) => `/admin/tutors/${id}/reject`,
  USERS: "/admin/users",
  DELETE_USER: (id: number) => `/admin/users/${id}`,
  PAYMENTS: "/admin/payments",
};

export default ADMIN_PATHS;
