import { IBaseResponse } from "./base";

export interface IMessage {
  id: number;
  senderId: number;
  receiverId: number;
  bookingId?: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export type IMessageListResponse = IBaseResponse<IMessage[]>;
