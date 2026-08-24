import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../http-client";
import ADMIN_PATHS from "../_paths/admin-path";
import SUBJECT_PATHS from "../_paths/subject-path";
import { QUERY_KEYS } from "../_constants/query-keys";
import { AdminStatsResponse, SubjectResponse, TutorPendingResponse, UserResponse } from "../_types/admin-type";
import { ApiResponse, IPageResponse } from "../_types/base";
// ... (các phần cũ giữ nguyên)
export const useGetUsers = (params?: { role?: string; isActive?: boolean; keyword?: string; page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.GET_USERS, params],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IPageResponse<UserResponse>>>(
        ADMIN_PATHS.USERS,
        { params }
      );
      return res.data;
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete<ApiResponse<void>>(ADMIN_PATHS.DELETE_USER(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.GET_USERS });
    },
  });
};

export const useGetSubjects = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.GET_SUBJECTS,
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<SubjectResponse[]>>(SUBJECT_PATHS.GET_LIST);
      return res.data;
    },
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<SubjectResponse>) => {
      const res = await axiosInstance.post<ApiResponse<SubjectResponse>>(SUBJECT_PATHS.CREATE, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.GET_SUBJECTS });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<SubjectResponse> & { id: number }) => {
      const res = await axiosInstance.put<ApiResponse<SubjectResponse>>(SUBJECT_PATHS.UPDATE(id), data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.GET_SUBJECTS });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete<ApiResponse<void>>(SUBJECT_PATHS.DELETE(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.GET_SUBJECTS });
    },
  });
};

export const useGetAdminStats = () => {
  return useQuery<AdminStatsResponse, Error>({
    queryKey: QUERY_KEYS.ADMIN.GET_STATS,
    queryFn: async () => {
      // Backend lacks unified stats endpoint in api-docs.json
      return {
        totalUsers: 0,
        totalTutors: 0,
        pendingTutors: 0,
        totalRevenue: 0,
      };
    },
  });
};

export const useGetTopTutors = () => {
  return useQuery({
    queryKey: ["ADMIN", "TOP_TUTORS"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<any[]>>(ADMIN_PATHS.TOP_TUTORS);
      return res.data;
    },
  });
};

export const useGetPendingTutors = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.GET_PENDING_TUTORS,
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IPageResponse<TutorPendingResponse>>>(
        ADMIN_PATHS.PENDING_TUTORS,
      );
      return res.data;
    }
  });
};


// Approve/Reject Mutations

export const useApproveTutor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await axiosInstance.post<ApiResponse<void>>(
        ADMIN_PATHS.APPROVE_TUTOR(Number(id)),
        {}
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.GET_PENDING_TUTORS });
    },
  });
};

export const useRejectTutor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string | number; reason: string }) => {
      const res = await axiosInstance.post<ApiResponse<void>>(
        ADMIN_PATHS.REJECT_TUTOR(Number(id)),
        { reason }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.GET_PENDING_TUTORS });
    },
  });
};

export const useGetPayments = () => {
  return useQuery<any[], Error>({
    queryKey: QUERY_KEYS.ADMIN.GET_PAYMENTS,
    queryFn: async () => {
      return [];
    },
  });
};

export const useGetWithdrawals = () => {
  return useQuery<any[], Error>({
    queryKey: QUERY_KEYS.ADMIN.GET_WITHDRAWALS,
    queryFn: async () => {
      return [];
    },
  });
};
