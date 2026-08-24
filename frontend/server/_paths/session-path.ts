const SESSION_PATHS = {
  GET_LIST: "/sessions",
  GET_DETAIL: (id: string | number) => `/sessions/${id}`,
  CONFIRM: (id: string | number) => `/sessions/${id}/confirm`,
  COMPLETE: (id: string | number) => `/sessions/${id}/complete`,
  CANCEL: (id: string | number) => `/sessions/${id}/cancel`,
  ADD_NOTE: (id: string | number) => `/sessions/${id}/notes`,
};

export default SESSION_PATHS;
