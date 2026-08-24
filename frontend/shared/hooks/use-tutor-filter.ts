import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  useSearchTutors, 
  useGetAllSubjects 
} from "@/server/_actions/tutor-action";

export const ITEMS_PER_PAGE = 5;

// Mapping Level to Grade (Approximate)




export function useTutorFilter() {
  const searchParams = useSearchParams();
  const { data: allSubjects } = useGetAllSubjects();

  const currentPage = parseInt(searchParams.get("page") || "1");

  const query = searchParams.get("q") || "";
  const selectedSubjectNames = searchParams.get("subject")?.split(",").filter(Boolean) || [];
  const minPriceK = parseInt(searchParams.get("minPrice") || "0");
  const maxPriceK = parseInt(searchParams.get("maxPrice") || "5000");
  const format = searchParams.get("format");
  const level = searchParams.get("level");

  // Map Subject Names to IDs
  const subjectId = useMemo(() => {
    if (selectedSubjectNames.length === 0 || !allSubjects) return undefined;
    // Current API only takes ONE subjectId. Let's take the first one.
    const firstSubject = allSubjects.find((s: any) => s.name === selectedSubjectNames[0]);
    return firstSubject?.id;
  }, [selectedSubjectNames, allSubjects]);

  const apiParams = useMemo(() => {
    return {
      page: currentPage - 1, // API is 0-indexed
      size: ITEMS_PER_PAGE,
      subjectId,
      grade: level && level !== "all" ? parseInt(level) : undefined,
      minPrice: minPriceK * 1000,
      maxPrice: maxPriceK * 1000,
      teachingMode: format?.toUpperCase(), // ONLINE, OFFLINE
      fullName: query || undefined,
    };
  }, [currentPage, subjectId, level, minPriceK, maxPriceK, format, query]);

  const { data, isLoading, isError, error } = useSearchTutors(apiParams);

  const paginatedTutors = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  return {
    filteredTutors: paginatedTutors, // For the "Found X tutors" count, we might want to use totalElements
    paginatedTutors,
    totalPages,
    currentPage,
    totalCount: totalElements,
    isLoading,
    isError,
    error,
  };
}
