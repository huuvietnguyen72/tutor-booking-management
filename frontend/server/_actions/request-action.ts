import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../http-client";
import REQUEST_PATHS from "../_paths/request-path";
import { QUERY_KEYS } from "../_constants/query-keys";
import {
  ICreateRequestRequest,
  IRequest,
  IApplicant,
  IApplication,
  IUpdateRequestRequest,
} from "../_types/request-type";
import { ApiResponse, IPageResponse } from "../_types/base";

// --- PARENT ACTIONS ---

// Create Request Mutation
export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateRequestRequest) => {
      const res = await axiosInstance.post<ApiResponse<IRequest>>(REQUEST_PATHS.CREATE, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS.GET_LIST });
      queryClient.invalidateQueries({ queryKey: ["MY_REQUESTS"] });
    },
  });
};

// Update Request Mutation
export const useUpdateRequest = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: IUpdateRequestRequest) => {
      const res = await axiosInstance.put<ApiResponse<string>>(REQUEST_PATHS.UPDATE(id.toString()), payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS.GET_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS.GET_DETAIL(id.toString()) });
      queryClient.invalidateQueries({ queryKey: ["MY_REQUESTS"] });
    },
  });
};

// Get My Requests (Parent)
export const useGetMyRequests = () => {
  return useQuery({
    queryKey: ["MY_REQUESTS"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IRequest[]>>(REQUEST_PATHS.GET_MY_REQUESTS);
      return res.data;
    },
  });
};

// Get Applicants for a Request
export const useGetApplicants = (id: string | number) => {
  return useQuery({
    queryKey: QUERY_KEYS.REQUESTS.GET_APPLICANTS(id.toString()),
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IApplicant[]>>(REQUEST_PATHS.GET_APPLICANTS(id.toString()));
      return res.data;
    },
    enabled: !!id,
  });
};

// Accept Applicant Mutation
export const useAcceptApplicant = (requestId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string | number) => {
      await axiosInstance.post(
        REQUEST_PATHS.ACCEPT_APPLICANT(applicationId.toString()),
        {}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS.GET_DETAIL(requestId.toString()) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS.GET_APPLICANTS(requestId.toString()) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.GET_LIST });
    },
  });
};

// Reject Applicant Mutation
export const useRejectApplicant = (requestId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string | number) => {
      await axiosInstance.post(
        REQUEST_PATHS.REJECT_APPLICANT(applicationId.toString()),
        {}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS.GET_DETAIL(requestId.toString()) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS.GET_APPLICANTS(requestId.toString()) });
    },
  });
};

// --- TUTOR ACTIONS (Marketplace) ---

// Get Public Request List
export const useGetRequests = () => {
  return useQuery({
    queryKey: QUERY_KEYS.REQUESTS.GET_LIST,
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IRequest[]>>(REQUEST_PATHS.GET_LIST);
      return res.data;
    },
  });
};

// Apply for a Request
export const useApplyForRequest = (requestId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { coverLetter: string; proposedPrice: number }) => {
      const res = await axiosInstance.post<ApiResponse<IApplication>>(REQUEST_PATHS.APPLY(requestId.toString()), payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MY_APPLICATIONS"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUESTS.GET_LIST });
    },
  });
};

// Get My Applications (Tutor)
export const useGetMyApplications = () => {
  return useQuery({
    queryKey: ["MY_APPLICATIONS"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IApplication[]>>(REQUEST_PATHS.MY_APPLICATIONS);
      return res.data;
    },
  });
};

// Withdraw Application
export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string | number) => {
      const res = await axiosInstance.delete<ApiResponse<string>>(REQUEST_PATHS.WITHDRAW_APPLICATION(applicationId.toString()));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MY_APPLICATIONS"] });
    },
  });
};

// Get Request Detail Query
export const useGetRequestDetail = (id: string | number) => {
  return useQuery({
    queryKey: QUERY_KEYS.REQUESTS.GET_DETAIL(id.toString()),
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IRequest>>(REQUEST_PATHS.GET_DETAIL(id.toString()));
      return res.data;
    },
    enabled: !!id,
  });
};
