import { ObjectId } from 'mongodb';

export type MessageStatus = 'sending' | 'sent' | 'read' | 'failed';

export type Reaction = {
  emoji: string;
  userIds: string[];
};

export type LinkPreviewData = {
  url: string;
  title: string;
  description: string;
  image: string;
};

export interface Message {
  _id?: ObjectId | string;
  senderId: string; 
  recipientId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  linkPreview?: LinkPreviewData;
  replyTo?: ObjectId | string; 
  isFavorited?: boolean;
  reactions?: Reaction[];
  attachment?: {
    type: 'image';
    url: string; 
  };
}