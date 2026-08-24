import { ChildRecord } from "@/shared/types/child";

export const MOCK_CHILDREN: ChildRecord[] = [
  {
    id: "1",
    name: "Nguyễn Mai Chi",
    level: "Lớp 3",
    school: "Tiểu học Chu Văn An",
    academicStatus: "EXCELLENT",
    avatarUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=300&h=300&auto=format&fit=crop",
    avatarBgColor: "bg-emerald-50",
    parentNotes: "Cần tập trung môn Toán hơn trong kỳ thi cuối kỳ.",
  },
  {
    id: "2",
    name: "Nguyễn Đức Anh",
    level: "Lớp 6",
    school: "THCS Trưng Vương",
    academicStatus: "GOOD",
    avatarUrl: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=300&h=300&auto=format&fit=crop",
    avatarBgColor: "bg-sky-50",
    parentNotes: "Đang tham gia câu lạc bộ bóng rổ trường, cần cân bằng thời gian học.",
  },
  {
    id: "3",
    name: "Nguyễn Gia Huy",
    level: "Lớp 1",
    school: "Tiểu học Chu Văn An",
    academicStatus: "AVERAGE",
    avatarUrl: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?q=80&w=300&h=300&auto=format&fit=crop",
    avatarBgColor: "bg-amber-50",
    parentNotes: "Bé còn ham chơi, cần gia sư kiên nhẫn rèn luyện thêm khả năng viết chữ.",
  },
];
