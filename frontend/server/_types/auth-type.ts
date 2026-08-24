import { IBaseResponse } from "./base";

export type IRole = "ADMIN" | "TUTOR" | "PARENT";

export interface ILoginRequest {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface IAuthResponse {
  exist?: boolean;
  token?: string;
  refreshToken?: string;
  email?: string;
  fullName?: string;
  role?: IRole;
}

export type ILoginResponse = IBaseResponse<IAuthResponse>;

export interface IRegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: IRole;
}

export type IRegisterResponse = IBaseResponse<null>;

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export type IRefreshTokenResponse = IBaseResponse<IAuthResponse>;

export interface IUserProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: IRole;
  address?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IUserProfileResponse = IBaseResponse<IUserProfile>;

export interface IUpdateProfileRequest {
  fullName?: string;
  phone?: string;
}

export interface IChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export interface IForgotPasswordRequest {
  email?: string;
}

export interface IResetPasswordRequest {
  token?: string;
  newPassword?: string;
}

export interface IGoogleLoginRequest {
  idToken: string;
  role?: IRole;
}

export type IGoogleLoginResponse = IBaseResponse<IAuthResponse>;
