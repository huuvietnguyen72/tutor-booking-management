import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý con cái | Gia sư Online",
  description: "Quản lý thông tin và kết quả học tập của các con",
};

export default function ChildrenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
