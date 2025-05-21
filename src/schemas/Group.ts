import { Status } from '@enums';
import { TypesObjectId } from '@schemas';
import { Document, Model } from 'mongoose';

export interface IGroup {
    name: string; // Name of the group
    creator: TypesObjectId; // User ID of the person who created the group
    members: TypesObjectId[]; // List of participants in the group
    description: string; // Group description (optional)
    imageUrl?: string; // Optional group image
    status: Status; // Whether the group is active or archived
}

export interface IGroupDoc extends IGroup, Document {
    _id: TypesObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type IGroupModel = Model<IGroupDoc>;
