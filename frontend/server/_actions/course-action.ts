import { useQuery } from "@tanstack/react-query";
import { ICourseStats } from "../_types/course-type";
import { axiosInstance } from "../http-client";
import BOOKING_PATHS from "../_paths/booking-path";
import { ApiResponse, IPageResponse } from "../_types/base";
import { IBooking } from "../_types/booking-type";

export const useGetCourseStats = () => {
  return useQuery<ICourseStats>({
    queryKey: ["course-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IPageResponse<IBooking>>>(
        BOOKING_PATHS.GET_LIST,
        { params: { size: 1000 } }
      );
      const apiResponse = res as unknown as ApiResponse<IPageResponse<IBooking>>;
      const bookings = apiResponse.data?.content || [];
      
      const totalCourses = bookings.length;
      const activeCourses = bookings.filter((b) => b.status === "ACTIVE" || b.status === "PAUSED").length;
      const completedCourses = bookings.filter((b) => b.status === "COMPLETED").length;
      const totalHours = bookings.reduce((sum, b) => sum + ((b.completedSessions || 0) * 1.5), 0);
      
      return {
        totalCourses,
        activeCourses,
        completedCourses,
        totalHours: Math.round(totalHours),
      };
    },
  });
};
