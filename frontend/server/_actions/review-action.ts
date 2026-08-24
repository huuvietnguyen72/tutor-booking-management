import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, axiosInstanceNoAuth } from "../http-client";
import REVIEW_PATHS from "../_paths/review-path";
import { QUERY_KEYS } from "../_constants/query-keys";
import {
  IReview,
  ISubmitReviewRequest,
  IReviewPageResponse,
  ITutorReviewSummaryResponse,
} from "../_types/review-type";
import { ApiResponse } from "../_types/base";

interface GetTutorReviewsParams {
  page?: number;
  size?: number;
}

// Submit Review Mutation
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ISubmitReviewRequest) => {
      const res = await axiosInstance.post<ApiResponse<IReview>>(REVIEW_PATHS.SUBMIT, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["REVIEWS"] });
    },
  });
};

// Get Tutor Reviews Query
export const useGetTutorReviews = (tutorId: string | number, params: GetTutorReviewsParams = {}) => {
  const { page = 0, size = 5 } = params;

  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS.GET_LIST(tutorId.toString(), page, size),
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.get<ITutorReviewSummaryResponse>(REVIEW_PATHS.GET_TUTOR_REVIEWS(tutorId.toString()), {
        params: { page, size },
      });
      return res.data;
    },
    enabled: !!tutorId,
    placeholderData: (previousData) => previousData,
  });
};

// Get Latest Reviews (for Home Page)
export const useGetLatestReviews = (limit = 6) => {
  return useQuery({
    queryKey: ["REVIEWS", "LATEST", limit],
    queryFn: async () => {
      const res = await axiosInstanceNoAuth.get<IReviewPageResponse>(REVIEW_PATHS.GET_ALL, { params: { size: limit } });
      return res.data;
    },
  });
};
