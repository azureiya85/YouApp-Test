import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  email: string;
  username: string;
  password?: string; 
  createdAt?: Date;
  updatedAt?: Date;
}