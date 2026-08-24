import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../http-client";
import SUBJECT_PATHS from "../_paths/subject-path";
import { ApiResponse } from "../_types/base";

export interface ISubject {
  id: number;
  name: string;
  description?: string;
}

export const useGetAllSubjects = () => {
  return useQuery<ApiResponse<ISubject[]>>({
    queryKey: ["all-subjects"],
    queryFn: () => axiosInstance.get(SUBJECT_PATHS.GET_LIST),
  });
};
