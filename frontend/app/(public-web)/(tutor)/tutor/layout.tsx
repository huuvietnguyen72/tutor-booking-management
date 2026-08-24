import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khám phá gia sư",
  description: "Tìm kiếm gia sư phù hợp theo môn học, địa điểm và đánh giá từ cộng đồng.",
};

export default function TutorSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
