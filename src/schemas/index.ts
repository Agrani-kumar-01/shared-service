import { Schema, Types } from 'mongoose';

export type TypesObjectId = Types.ObjectId;
export const ObjectId = Schema.Types.ObjectId;

export interface EncryptionData {
    key: string;
    text: string;
}

export interface DecryptionData {
    key: string;
    encryptedText: string;
}

export * from './Chat';
export * from './Group';
export * from './User';
