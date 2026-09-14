import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { describe, expect, test, vi } from "vitest";
import { useSubmitReview } from "../review-action";

const { submitReview } = vi.hoisted(() => ({ submitReview: vi.fn() }));

vi.mock("../../http-client", () => ({
  axiosInstance: { post: submitReview },
  axiosInstanceNoAuth: { get: vi.fn() },
}));

function SubmitReviewButton() {
  const { mutate } = useSubmitReview();

  return createElement(
    "button",
    { onClick: () => mutate({ bookingId: 43, rating: 5, comment: "Rất tốt" }) },
    "Submit review",
  );
}

describe("useSubmitReview", () => {
  test("invalidates review and booking data after a successful submission", async () => {
    submitReview.mockResolvedValue({ data: { id: 1 } });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    render(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(SubmitReviewButton),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit review" }));

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["REVIEWS"] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["my-bookings"] });
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ["booking-detail", 43],
      });
    });
  });
});
