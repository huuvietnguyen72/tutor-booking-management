export const QUERY_KEYS = {
  AUTH: {
    GET_ME: ["AUTH", "GET_ME"] as const,
  },
  REQUESTS: {
    GET_LIST: ["REQUESTS", "GET_LIST"] as const,
    GET_DETAIL: (id: string) => ["REQUESTS", "GET_DETAIL", id] as const,
    GET_APPLICANTS: (id: string) => ["REQUESTS", "GET_APPLICANTS", id] as const,
  },
  REVIEWS: {
    GET_LIST: (tutorId: string, page = 0, size = 5) => ["REVIEWS", "GET_LIST", tutorId, page, size] as const,
  },
  BOOKINGS: {
    GET_LIST: ["BOOKINGS", "GET_LIST"] as const,
    GET_DETAIL: (id: string) => ["BOOKINGS", "GET_DETAIL", id] as const,
  },
  ADMIN: {
    GET_STATS: ["ADMIN", "GET_STATS"] as const,
    GET_PENDING_TUTORS: ["ADMIN", "GET_PENDING_TUTORS"] as const,
    GET_USERS: ["ADMIN", "GET_USERS"] as const,
    GET_PAYMENTS: ["ADMIN", "GET_PAYMENTS"] as const,
    GET_SUBJECTS: ["ADMIN", "GET_SUBJECTS"] as const,
    GET_WITHDRAWALS: ["ADMIN", "GET_WITHDRAWALS"] as const,
  },
} as const;
