const REQUEST_PATHS = {
  GET_LIST: "/tutor-requests",
  CREATE: "/tutor-requests",
  GET_MY_REQUESTS: "/tutor-requests/my-requests",
  GET_DETAIL: (id: string) => `/tutor-requests/${id}`,
  UPDATE: (id: string) => `/tutor-requests/${id}`,
  GET_APPLICANTS: (id: string) => `/tutor-requests/${id}/applications`,
  ACCEPT_APPLICANT: (applicantId: string) => `/tutor-requests/applications/${applicantId}/accept`,
  REJECT_APPLICANT: (applicantId: string) => `/tutor-requests/applications/${applicantId}/reject`,
  
  // Tutor actions
  APPLY: (requestId: string) => `/tutor-requests/${requestId}/apply`,
  MY_APPLICATIONS: "/tutor-requests/applications/my-applications",
  WITHDRAW_APPLICATION: (applicationId: string) => `/tutor-requests/applications/${applicationId}/withdraw`,
};

export default REQUEST_PATHS;
