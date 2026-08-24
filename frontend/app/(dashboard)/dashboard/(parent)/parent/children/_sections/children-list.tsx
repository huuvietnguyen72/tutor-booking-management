import { IStudent } from "@/server/_types/student-type";
import { ChildCard } from "./child-card"; 

interface ChildrenListProps {
  childrenRecords: IStudent[];
  onEditClick: (child: IStudent) => void;
  onDeleteClick: (id: number) => void;
}

export function ChildrenList({ childrenRecords, onEditClick, onDeleteClick }: ChildrenListProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {childrenRecords.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border bg-muted/30 py-20 text-center animate-in fade-in zoom-in duration-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative rounded-full bg-card p-6 shadow-xl border border-border">
              <span className="text-5xl">👨‍👩‍👧‍👦</span>
            </div>
          </div>
          <h3 className="text-xl font-black text-foreground tracking-tight">Chưa có thông tin con</h3>
          <p className="mt-2 text-muted-foreground font-medium max-w-sm px-6 leading-relaxed">
            Bắt đầu bằng cách thêm thông tin con của bạn để chúng tôi có thể tìm kiếm gia sư phù hợp nhất.
          </p>
        </div>
      ) : (
        childrenRecords.map((child) => (
          <ChildCard 
            key={child.id} 
            child={child} 
            onEdit={() => onEditClick(child)}
            onDelete={() => onDeleteClick(child.id)}
          />
        ))
      )}
    </div>
  );
}

