import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../http-client";
import SESSION_PATHS from "../_paths/session-path";
import { ISession, SessionStatus } from "../_types/session-type";
import { ApiResponse, IPageResponse } from "../_types/base";

export interface ISessionParams {
  page?: number;
  size?: number;
  bookingId?: number;
  status?: SessionStatus;
  startTime?: string;
  endTime?: string;
}

export const useGetMySessions = (params?: ISessionParams) => {
  return useQuery({
    queryKey: ["my-sessions", params],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IPageResponse<ISession>>>(SESSION_PATHS.GET_LIST, { params });
      return res.data;
    },
  });
};

export const useGetSessionDetail = (id: string | number) => {
  return useQuery({
    queryKey: ["session-detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<ISession>>(SESSION_PATHS.GET_DETAIL(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useConfirmSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      axiosInstance.put(SESSION_PATHS.CONFIRM(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-detail"] });
    },
  });
};

export const useCompleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      axiosInstance.put(SESSION_PATHS.COMPLETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-detail"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
};

export const useCancelSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string | number; reason: string }) =>
      axiosInstance.put(SESSION_PATHS.CANCEL(id), { cancelReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-detail"] });
    },
  });
};

export const useAddSessionNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string | number; note: string }) =>
      axiosInstance.post(SESSION_PATHS.ADD_NOTE(id), { sessionNote: note }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["session-detail", id] });
    },
  });
};
