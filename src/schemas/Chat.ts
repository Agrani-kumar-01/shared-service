import { TypesObjectId } from '@schemas';
import { Document, Model } from 'mongoose';

export interface IChat {
    sender: TypesObjectId;
    group?: TypesObjectId;
    receiver?: TypesObjectId;
    content: string;
    isDeleted: boolean;
    readBy: TypesObjectId[];
}

export interface IChatDoc extends IChat, Document {
    _id: TypesObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type IChatModel = Model<IChatDoc>;
