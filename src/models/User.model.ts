import { LockLevel, Status } from '@enums';
import { IUserDoc, IUserModel } from '@schemas';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema<IUserDoc>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        avatar: { type: String },
        password: { type: String },
        status: { type: String, enum: Object.values(Status), default: Status.ACTIVE },
        failedAttempts: { type: Number, default: 0 },
        firstFailedAt: { type: Date },
        lockUntil: { type: Date },
        lockLevel: { type: Number, enum: Object.values(LockLevel) },
    },
    {
        id: false,
        timestamps: true,
        toJSON: {
            getters: true,
        },
        toObject: {
            getters: true,
        },
    }
);

export const User = model<IUserDoc, IUserModel>('User', UserSchema, 'users');
