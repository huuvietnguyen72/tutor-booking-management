import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, axiosInstanceNoAuth } from "../http-client";
import { TUTOR_PATH } from "../_paths/tutor-path";
import { ApiResponse, IPageResponse } from "../_types/base";
import {
  ITutorDetail,
  ITutorSubject,
  ITutorAvailability,
  IUpdateTutorRequest,
  ITutorSubjectRequest,
  ITutorAvailabilityRequest,
  ISubject,
} from "../_types/tutor-type";
import { ITutorReviewSummary } from "../_types/review-type";

// --- Hooks ---

// 0. Get All Available Subjects (for selection)
export const useGetAllSubjects = () => {
  return useQuery({
    queryKey: ["all-subjects"],
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.get<ApiResponse<ISubject[]>>(
        TUTOR_PATH.GET_ALL_SUBJECTS,
      );
      return res.data;
    },
  });
};

// 1. Get Logged-in Tutor Profile
export const useGetTutorProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["tutor-profile"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<ITutorDetail>>(
        TUTOR_PATH.GET_MY_PROFILE,
      );
      return res.data; // Trả về ITutorDetail trực tiếp
    },
    enabled,
  });
};

// 2. Update Logged-in Tutor Profile
export const useUpdateTutorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IUpdateTutorRequest) => {
      const res = await axiosInstance.put<ApiResponse<void>>(
        TUTOR_PATH.UPDATE_PROFILE,
        data,
      );
      return res; // Trả về ApiResponse để lấy message
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
    },
  });
};

// 3. Get Tutor Subjects
export const useGetTutorSubjects = (
  tutorId: string | number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["tutor-subjects", tutorId],
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.get<ApiResponse<ITutorSubject[]>>(
        TUTOR_PATH.GET_SUBJECTS(tutorId),
      );
      return res.data;
    },
    enabled: !!tutorId && enabled,
  });
};

// 4. Manage Subjects (Add, Update, Delete)
export const useAddTutorSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ITutorSubjectRequest) => {
      const res = await axiosInstance.post<ApiResponse<ITutorSubject>>(
        TUTOR_PATH.ADD_SUBJECT,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-subjects"] });
    },
  });
};

export const useUpdateTutorSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: ITutorSubjectRequest;
    }) => {
      const res = await axiosInstance.put<ApiResponse<ITutorSubject>>(
        TUTOR_PATH.UPDATE_SUBJECT(id),
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-subjects"] });
    },
  });
};

export const useDeleteTutorSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete<ApiResponse<void>>(
        TUTOR_PATH.DELETE_SUBJECT(id),
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-subjects"] });
    },
  });
};

// 5. Get Tutor Availability
export const useGetTutorAvailability = (
  tutorId: string | number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["tutor-availability", tutorId],
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.get<ApiResponse<ITutorAvailability[]>>(
        TUTOR_PATH.GET_AVAILABILITY(tutorId),
      );
      return res.data;
    },
    enabled: !!tutorId && enabled,
  });
};

// 6. Manage Availability
export const useAddTutorAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ITutorAvailabilityRequest) => {
      const res = await axiosInstance.post<ApiResponse<ITutorAvailability>>(
        TUTOR_PATH.ADD_AVAILABILITY,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-availability"] });
    },
  });
};

export const useUpdateTutorAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: ITutorAvailabilityRequest;
    }) => {
      const res = await axiosInstance.put<ApiResponse<ITutorAvailability>>(
        TUTOR_PATH.UPDATE_AVAILABILITY(id),
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-availability"] });
    },
  });
};

export const useDeleteTutorAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete<ApiResponse<void>>(
        TUTOR_PATH.DELETE_AVAILABILITY(id),
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-availability"] });
    },
  });
};

// 7. Search Tutors
export const useSearchTutors = (params: any) => {
  return useQuery({
    queryKey: ["search-tutors", params],
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.get<
        ApiResponse<IPageResponse<ITutorDetail>>
      >(TUTOR_PATH.SEARCH, {
        params,
      });
      return res.data;
    },
  });
};

// 8. Get Tutor Detail
export const useGetTutorDetail = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["tutor-detail", id],
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.get<ApiResponse<ITutorDetail>>(
        TUTOR_PATH.GET_DETAIL(id),
      );
      return res.data;
    },
    enabled: !!id && enabled,
  });
};

// 9. Get Tutor Reviews
export const useGetTutorReviews = (id: string | number, params?: any) => {
  return useQuery({
    queryKey: ["tutor-reviews", id, params],
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.get<ApiResponse<ITutorReviewSummary>>(
        TUTOR_PATH.GET_REVIEWS(id),
        { params },
      );
      return res.data;
    },
    enabled: !!id,
  });
};
