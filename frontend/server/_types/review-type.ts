import { ApiResponse, IPageResponse } from "./base";

export interface IReview {
  id: number;
  bookingId: number;
  tutorId: number;
  tutorName?: string;
  parentId: number;
  parentName: string;
  parentAvatar?: string;
  subjectName?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ISubmitReviewRequest {
  bookingId: number;
  rating: number;
  comment: string;
}

export type IReviewPageResponse = ApiResponse<IPageResponse<IReview>>;

export interface IReviewResponse {
  id: number;
  studentName?: string;
  parentName?: string;
  rating: number | string;
  comment: string;
  createdAt: string;
  subjectName?: string;
}

export interface ITutorReviewSummary {
  averageRating: number;
  totalReviews: number;
  reviews: IReviewResponse[] | IPageResponse<IReviewResponse>;
}

export type ITutorReviewSummaryResponse = ApiResponse<ITutorReviewSummary>;
