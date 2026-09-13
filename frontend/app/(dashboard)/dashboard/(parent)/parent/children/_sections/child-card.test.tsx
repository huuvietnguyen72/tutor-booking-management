import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { IStudent } from "@/server/_types/student-type";
import { ChildCard } from "./child-card";

describe("ChildCard", () => {
  test("renders a lowercase academic-level wire fixture with a canonical badge", () => {
    const child = {
      id: 1,
      parentId: 1,
      fullName: "Nguyen Van Test",
      grade: 5,
      school: "Test School",
      academicLevel: "good",
      specialNotes: "No notes",
    } as unknown as IStudent;

    render(<ChildCard child={child} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("GOOD")).toBeInTheDocument();
  });
});
