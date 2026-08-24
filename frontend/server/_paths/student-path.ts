const STUDENT_PATHS = {
  GET_LIST: "/parents/students",
  CREATE: "/parents/students",
  GET_DETAIL: (id: string | number) => `/parents/students/${id}`,
  UPDATE: (id: string | number) => `/parents/students/${id}`,
  DELETE: (id: string | number) => `/parents/students/${id}`,
};

export default STUDENT_PATHS;
