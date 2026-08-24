import { IBaseResponse } from "./base";

export interface INotification {
  id: number;
  userId: number;
  title: string;
  content: string; // "message" in DB
  isRead: boolean;
  createdAt: string;
}

export type INotificationResponse = IBaseResponse<INotification[]>;
