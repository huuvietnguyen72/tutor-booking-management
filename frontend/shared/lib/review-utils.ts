import { formatTimeAgo } from "@/shared/lib/utils";
import { Review } from "@/shared/types/tutor-detail";
import { IReviewResponse } from "@/server/_types/review-type";

export const normalizeTutorReviewResponses = (reviews: unknown): IReviewResponse[] => {
  if (Array.isArray(reviews)) {
    return reviews as IReviewResponse[];
  }

  if (reviews && typeof reviews === "object" && "content" in reviews) {
    const content = (reviews as { content?: unknown }).content;
    return Array.isArray(content) ? (content as IReviewResponse[]) : [];
  }

  return [];
};

export const getReviewDisplayName = (review: IReviewResponse) => {
  return review.studentName || review.parentName || "Người đánh giá";
};

export const getReviewAvatarUrl = (review: IReviewResponse) => {
  const seed = review.studentName || review.parentName || review.id;
  return `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;
};

export const mapTutorReviewResponsesToDisplayReviews = (reviews: IReviewResponse[]): Review[] => {
  return reviews.map((review) => ({
    name: getReviewDisplayName(review),
    avatar: getReviewAvatarUrl(review),
    comment: review.comment,
    rating: Number(review.rating || 0),
    timeAgo: formatTimeAgo(review.createdAt),
  }));
};