import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import MarketplacePage from "./page";

vi.mock("@/server/_actions/tutor-action", () => ({
  useSearchTutors: () => ({ data: { totalElements: 24 } }),
}));

vi.mock("./_sections/direct-invitations", () => ({
  DirectInvitations: () => <div>Lời mời riêng</div>,
}));

vi.mock("./_sections/job-list", () => ({
  JobList: () => <div>Chợ lớp học</div>,
}));

vi.mock("./_sections/my-applications", () => ({
  MyApplications: () => <div>Ứng tuyển của tôi</div>,
}));

describe("MarketplacePage", () => {
  test("exposes direct invitations, the class marketplace, and my applications tabs", () => {
    render(<MarketplacePage />);

    expect(screen.getByRole("tab", { name: "Lời mời riêng" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Chợ lớp học" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Ứng tuyển của tôi" })).toBeInTheDocument();
  });
});
