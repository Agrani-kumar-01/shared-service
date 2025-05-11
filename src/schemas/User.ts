import { Status } from '@enums';
import { TypesObjectId } from '@schemas';
import { Document, Model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    avatar?: string;
    password?: string;
    status: Status;
    authTokenIssuedAt: number;
    failedAttempts: number;
    firstFailedAt: Date | null;
    lockUntil: number;
    passwordChangedAt: number;
}

export interface IUserDoc extends IUser, Document {
    _id: TypesObjectId;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

export type IUserModel = Model<IUserDoc>;
