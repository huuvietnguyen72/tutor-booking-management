const SUBJECT_PATHS = {
  GET_LIST: "/subjects",
  CREATE: "/subjects",
  GET_DETAIL: (id: string | number) => `/subjects/${id}`,
  UPDATE: (id: string | number) => `/subjects/${id}`,
  DELETE: (id: string | number) => `/subjects/${id}`,
};

export default SUBJECT_PATHS;
