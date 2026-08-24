import { cn } from "@/shared/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-linear-to-r from-gray-200/50 via-gray-100 to-gray-200/50 bg-size-[400%_100%]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
