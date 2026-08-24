import CalendarCheckIcon from '@/shared/components/icons/calendar-check-icon';
import RightIcon from '@/shared/components/icons/right-icon';
import RocketIcon from '@/shared/components/icons/rocket-icon';
import UserSearchIcon from '@/shared/components/icons/user-search-icon';

export const StepsSection = () => {
  const steps = [
    {
      id: 1,
      title: "1. Tìm kiếm gia sư",
      description: "Lọc theo môn học, lớp và khu vực của bạn để tìm người phù hợp nhất.",
      icon: <UserSearchIcon className="w-6 h-6 text-primary" strokeWidth={2} />,
    },
    {
      id: 2,
      title: "2. Đặt lịch học thử",
      description: "Trao đổi và đặt buổi học thử miễn phí để kiểm tra mức độ phù hợp.",
      icon: <CalendarCheckIcon className="w-6 h-6 text-primary" strokeWidth={2} />,
    },
    {
      id: 3,
      title: "3. Bắt đầu hành trình",
      description: "Chốt lịch học chính thức và bắt đầu cải thiện kết quả học tập ngay.",
      icon: <RocketIcon className="w-6 h-6 text-primary" strokeWidth={2} />,
    }
  ];

  return (
    <section className="py-24 bg-background transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h2 className="text-3xl md:text-3xl font-bold text-center text-foreground mb-16 tracking-tight">
          Bắt đầu học ngay với 3 bước đơn giản
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center relative z-10 group cursor-default">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                {step.description}
              </p>
              {/* Connecting Arrows - hidden on mobile, visible on md and up */}
              {step.id !== 3 && (
                <div className="hidden md:flex absolute top-10 right-0 translate-x-[calc(50%+1rem)] -translate-y-1/2 pointer-events-none z-0 text-primary/40 animate-pulse">
                  <RightIcon />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
