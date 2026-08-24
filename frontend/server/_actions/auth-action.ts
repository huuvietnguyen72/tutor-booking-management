import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setCookie, deleteCookie } from "cookies-next";

import { axiosInstance, axiosInstanceNoAuth } from "../http-client";
import AUTH_PATHS from "../_paths/auth-path";
import { APP_SAVE_KEY, ROUTES } from "@/shared/constants/app";
import { QUERY_KEYS } from "../_constants/query-keys";
import {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  IAuthResponse,
  IUserProfile,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IGoogleLoginRequest,
  IGoogleLoginResponse,
  IUpdateProfileRequest,
  IChangePasswordRequest,
  IUserProfileResponse,
} from "../_types/auth-type";
import { TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../_constants/auth";
import { IBaseResponse } from "../_types/base";

const setAuthCookies = (
  token: string | undefined,
  refreshToken: string | undefined,
  role: string | undefined,
  rememberMe?: boolean
) => {
  if (!token || !refreshToken) return;
  const tokenOptions = { maxAge: TOKEN_MAX_AGE, path: "/" };
  const refreshTokenOptions = { maxAge: REFRESH_TOKEN_MAX_AGE, path: "/" };

  setCookie(APP_SAVE_KEY.TOKEN_KEY, token, tokenOptions);
  setCookie(APP_SAVE_KEY.REFRESH_TOKEN_KEY, refreshToken, refreshTokenOptions);

  if (role) {
    setCookie(APP_SAVE_KEY.USER_ROLE, role, tokenOptions);
  }

  if (rememberMe !== undefined) {
    const rememberMeOptions = { maxAge: REFRESH_TOKEN_MAX_AGE, path: "/" };
    setCookie("REMEMBER_ME", rememberMe ? "true" : "false", rememberMeOptions);
  }
};


// Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<IAuthResponse, Error, ILoginRequest>({
    mutationFn: async (data: ILoginRequest) => {
      const { rememberMe, ...loginData } = data;
      const response = await axiosInstanceNoAuth.post<ILoginResponse>(
        AUTH_PATHS.LOGIN,
        loginData,
      );
      const { token, refreshToken, role } = response.data;
      
      setAuthCookies(token, refreshToken, role, rememberMe);
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.GET_ME });
    },
  });
};

// Register Mutation
export const useRegister = () => {
  return useMutation<IRegisterResponse, Error, IRegisterRequest>({
    mutationFn: async (data: IRegisterRequest) => {
      const response = await axiosInstanceNoAuth.post<IRegisterResponse>(
        AUTH_PATHS.REGISTER,
        data,
      );
      return response;
    },
  });
};

// Get User Profile Query
export const useGetMe = (options: { enabled: boolean } = { enabled: true }) => {
  const queryFn = async (): Promise<IUserProfile> => {
    const response = await axiosInstance.get<IUserProfileResponse>(AUTH_PATHS.GET_ME);
    return response.data;
  };

  return useQuery<IUserProfile, Error>({
    queryKey: QUERY_KEYS.AUTH.GET_ME,
    queryFn,
    ...options,
  });
};

// Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post(AUTH_PATHS.LOGOUT, {});
    },
    onSuccess: () => {
      deleteCookie(APP_SAVE_KEY.TOKEN_KEY, { path: "/" });
      deleteCookie(APP_SAVE_KEY.REFRESH_TOKEN_KEY, { path: "/" });
      deleteCookie(APP_SAVE_KEY.USER_ROLE, { path: "/" });
      queryClient.clear();
    },
  });
};

// Forgot Password Mutation
export const useForgotPassword = () => {
  return useMutation<IBaseResponse<null>, Error, IForgotPasswordRequest>({
    mutationFn: async (data: IForgotPasswordRequest) => {
      const response = await axiosInstanceNoAuth.post<IBaseResponse<null>>(
        AUTH_PATHS.FORGOT_PASSWORD,
        data,
      );
      return response;
    },
  });
};

// Reset Password Mutation
export const useResetPassword = () => {
  return useMutation<IBaseResponse<null>, Error, IResetPasswordRequest>({
    mutationFn: async (data: IResetPasswordRequest) => {
      const response = await axiosInstanceNoAuth.post<IBaseResponse<null>>(
        AUTH_PATHS.RESET_PASSWORD,
        data,
      );
      return response;
    },
  });
};

// Google Login Mutation
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<IAuthResponse, Error, IGoogleLoginRequest>({
    mutationFn: async (data: IGoogleLoginRequest) => {
      const response = await axiosInstanceNoAuth.post<IGoogleLoginResponse>(
        AUTH_PATHS.GOOGLE_LOGIN,
        data,
      );
      const { exist, token, refreshToken, role } = response.data;
      
      // Only set cookies if it was a successful login (exist: true)
      if (exist) {
        setAuthCookies(token, refreshToken, role);
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data.exist) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.GET_ME });
      }
    },
  });
};

// Google Register Mutation (Role Selection)
export const useGoogleRegister = () => {
  const queryClient = useQueryClient();
  return useMutation<IAuthResponse, Error, IGoogleLoginRequest>({
    mutationFn: async (data: IGoogleLoginRequest) => {
      const response = await axiosInstanceNoAuth.post<IGoogleLoginResponse>(
        AUTH_PATHS.GOOGLE_REGISTER,
        data,
      );
      const { token, refreshToken, role } = response.data;
      
      if (token && refreshToken) {
        setAuthCookies(token, refreshToken, role);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.GET_ME });
    },
  });
};
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserProfileResponse, Error, IUpdateProfileRequest>({
    mutationFn: async (data: IUpdateProfileRequest) => {
      const response = await axiosInstance.put<IUserProfileResponse>(AUTH_PATHS.PROFILE, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.GET_ME });
    },
  });
};

export const useChangePassword = () => {
  return useMutation<IBaseResponse<null>, Error, IChangePasswordRequest>({
    mutationFn: async (data: IChangePasswordRequest) => {
      const response = await axiosInstance.put<IBaseResponse<null>>(AUTH_PATHS.CHANGE_PASSWORD, data);
      return response;
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation<IBaseResponse<{ avatarUrl: string }>, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post<IBaseResponse<{ avatarUrl: string }>>(
        AUTH_PATHS.UPLOAD_AVATAR,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.GET_ME });
    },
  });
};
