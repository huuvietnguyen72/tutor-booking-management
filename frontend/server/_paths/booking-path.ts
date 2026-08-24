const BOOKING_PATHS = {
  GET_LIST: "/bookings",
  CREATE: "/bookings",
  GET_DETAIL: (id: string | number) => `/bookings/${id}`,
  PAUSE: (id: string | number) => `/bookings/${id}/pause`,
  RESUME: (id: string | number) => `/bookings/${id}/resume`,
  ACCEPT: (id: string | number) => `/bookings/${id}/accept`,
  CANCEL: (id: string | number) => `/bookings/${id}/cancel`,
};

export default BOOKING_PATHS;
