const REVIEW_PATHS = {
  SUBMIT: "/reviews",
  GET_ALL: "/reviews",
  GET_TUTOR_REVIEWS: (tutorId: string) => `/tutors/${tutorId}/reviews`,
};

export default REVIEW_PATHS;
