import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../http-client";
import STUDENT_PATHS from "../_paths/student-path";
import { IStudent } from "../_types/student-type";
import { ApiResponse } from "../_types/base";

export const useGetMyStudents = () => {
  return useQuery({
    queryKey: ["my-students"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<IStudent[]>>(STUDENT_PATHS.GET_LIST);
      return res.data;
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IStudent, "id" | "parentId">) =>
      axiosInstance.post(STUDENT_PATHS.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: IStudent) =>
      axiosInstance.put(STUDENT_PATHS.UPDATE(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-students"] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => axiosInstance.delete(STUDENT_PATHS.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-students"] });
    },
  });
};
