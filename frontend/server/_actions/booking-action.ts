import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../http-client";
import BOOKING_PATHS from "../_paths/booking-path";
import { IBooking, IBookingStats, BookingStatus } from "../_types/booking-type";
import { ApiResponse, IPageResponse } from "../_types/base";
import { IDirectInvitation } from "../_types/marketplace-type";

export const useGetMyBookings = (params?: {
  page?: number;
  size?: number;
  perPage?: number;
  status?: string;
}) => {
  // Backend dùng 0-based pagination, UI dùng 1-based
  const backendParams: any = {};
  if (params) {
    if (params.page != null) backendParams.page = params.page - 1;
    if (params.size != null) backendParams.size = params.size;
    if (params.perPage != null) backendParams.size = params.perPage;
    if (params.status) backendParams.status = params.status;
  }

  return useQuery({
    queryKey: ["my-bookings", params],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IPageResponse<IBooking>>>(
        BOOKING_PATHS.GET_LIST,
        { params: backendParams },
      );
      // HttpClient.request() trả về response.data trực tiếp
      // Nên res đã là ApiResponse<IPageResponse<IBooking>> = { success, message, data: { content: [] } }
      const apiResponse = res as unknown as ApiResponse<IPageResponse<IBooking>>;
      return apiResponse.data;
    },
  });
};

export const useGetBookingDetail = (id: string | number) => {
  return useQuery({
    queryKey: ["booking-detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IBooking>>(
        BOOKING_PATHS.GET_DETAIL(id),
      );
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axiosInstance.post(BOOKING_PATHS.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
};

export const usePauseBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      axiosInstance.put(BOOKING_PATHS.PAUSE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking-detail"] });
    },
  });
};

export const useResumeBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      axiosInstance.put(BOOKING_PATHS.RESUME(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking-detail"] });
    },
  });
};

export const useAcceptBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      axiosInstance.put(BOOKING_PATHS.ACCEPT(id)),
    onSuccess: () => {
      // Delay invalidation so direct invitation card can show "Đã đồng ý" optimistic state briefly
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
        queryClient.invalidateQueries({ queryKey: ["booking-detail"] });
        queryClient.invalidateQueries({ queryKey: ["direct-invitations"] });
      }, 2500);
    },
  });
};

export const useDeclineBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      axiosInstance.put(BOOKING_PATHS.CANCEL(id)),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
        queryClient.invalidateQueries({ queryKey: ["booking-detail"] });
        queryClient.invalidateQueries({ queryKey: ["direct-invitations"] });
      }, 2500);
    },
  });
};

/**
 * Mapping helper to convert IBooking (real) to IDirectInvitation (legacy/UI)
 */
export const mapBookingToInvitation = (booking: IBooking): IDirectInvitation => {
  let status: IDirectInvitation["status"] = "PENDING";
  
  // Mapping status từ backend sang frontend
  if (booking.status === "ACTIVE" || booking.status === "COMPLETED" || booking.status === "PAUSED")
    status = "ACCEPTED";
  else if (booking.status === "PENDING_PAYMENTS") 
    status = "PENDING_PAYMENTS";
  else if (booking.status === "CANCELLED") 
    status = "DECLINED";
  else if (booking.status === "WAITING_TUTOR_CONFIRM" || booking.status === "PENDING") 
    status = "PENDING";

  // Lấy thông tin lịch học
  const scheduleStr = booking.schedules?.map(s => {
    const dayNames = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return `${dayNames[s.dayOfWeek]}: ${s.startTime.substring(0, 5)}-${s.endTime.substring(0, 5)}`;
  }).join("; ") || "Chưa có lịch cụ thể";

  return {
    id: booking.id.toString(),
    // Phụ huynh hiện tại backend chưa trả về name, dùng ID tạm
    parentName: booking.tutorName ? `Phụ huynh của ${booking.studentName || "học sinh"}` : `Phụ huynh #${booking.parentId}`,
    studentName: booking.studentName || `Học sinh #${booking.studentId}`,
    parentAvatar: booking.parentAvatar,
    tutorAvatar: booking.tutorAvatar,
    subjectName: booking.subjectName || `Môn học #${booking.subjectId}`,
    grade: `Khối ${booking.gradeLevel}`,
    budget: booking.pricePerSession,
    message: `Hình thức: ${booking.teachingMode === "ONLINE" ? "Online" : "Tại nhà"}. Lịch học: ${scheduleStr}.`,
    status,
    createdAt: booking.recurringStartDate || new Date().toISOString(),
  };
};

export const useGetDirectInvitations = (params?: {
  page?: number;
  perPage?: number;
  status?: string;
}) => {
  const query = useGetMyBookings({
    page: params?.page,
    perPage: params?.perPage,
  });

  const transformedData = query.data
    ? {
        data: query.data.content.map(mapBookingToInvitation),
        meta: {
          totalCount: query.data.totalElements,
          totalPages: query.data.totalPages,
          currentPage: query.data.page + 1,
        },
      }
    : undefined;

  return {
    ...query,
    data: transformedData,
  };
};


export const useRespondToInvitation = () => {
  const acceptMutation = useAcceptBooking();
  const declineMutation = useDeclineBooking();

  const isPending = acceptMutation.isPending || declineMutation.isPending;

  const mutate = (
    { id, status }: { id: string; status: "ACCEPTED" | "DECLINED" },
    options?: { onSuccess?: (res: any) => void; onError?: (err: any) => void },
  ) => {
    const mutation = status === "ACCEPTED" ? acceptMutation : declineMutation;
    return mutation.mutate(id, {
      onSuccess: (res) => {
        if (options?.onSuccess) {
          options.onSuccess({
            message:
              status === "ACCEPTED"
                ? "Đã chấp nhận lời mời!"
                : "Đã từ chối lời mời.",
          });
        }
      },
      onError: (err) => {
        if (options?.onError) options.onError(err);
      },
    });
  };

  return {
    mutate,
    isPending,
  };
};

/**
 * Thống kê được tính toán client-side từ danh sách booking
 * vì Backend chưa cung cấp endpoint thống kê riêng.
 */
export const useGetBookingStats = () => {
  const { data: pageData, isLoading } = useGetMyBookings({ size: 1000 }); // Lấy hết để tính toán

  const bookings: IBooking[] = pageData?.content || [];

  const stats: IBookingStats = {
    totalBookings: bookings.length,
    activeBookings: bookings.filter((b) => b.status === "ACTIVE").length,
    completedBookings: bookings.filter((b) => b.status === "COMPLETED").length,
    totalSpent: bookings.reduce(
      (acc, curr) => acc + curr.pricePerSession * (curr.completedSessions || 0),
      0,
    ),
  };

  return {
    data: stats,
    isLoading,
  };
};
