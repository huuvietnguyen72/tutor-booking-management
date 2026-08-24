"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function ToastListener() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "unauthenticated") {
      toast.error("Bạn cần đăng nhập để truy cập trang này.");
    } else if (error === "unauthorized") {
      toast.error("Bạn không có quyền truy cập trang này.");
    }
    
    // Clear the error from URL without refreshing
    if (error) {
       const url = new URL(window.location.href);
       url.searchParams.delete("error");
       window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return null;
}

export function GlobalToastHandler() {
  return (
    <Suspense fallback={null}>
      <ToastListener />
    </Suspense>
  );
}
