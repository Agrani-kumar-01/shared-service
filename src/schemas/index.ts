import { Schema, Types } from 'mongoose';

export type TypesObjectId = Types.ObjectId;
export const ObjectId = Schema.Types.ObjectId;

export * from './User';
