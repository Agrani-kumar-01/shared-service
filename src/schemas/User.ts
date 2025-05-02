import { LockLevel, Status } from '@enums';
import { TypesObjectId } from '@schemas';
import { Document, Model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    avatar?: string;
    password?: string;
    status: Status;
    failedAttempts: number;
    firstFailedAt: Date | null;
    lockUntil: Date | null;
    lockLevel: LockLevel; // 1 (10 min), 2 (1 hour), 3 (permanent until forgot password)
}

export interface IUserDoc extends IUser, Document {
    _id: TypesObjectId;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

export type IUserModel = Model<IUserDoc>;
