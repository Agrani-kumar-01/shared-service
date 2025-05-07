import { Status } from '@enums';
import { IUserDoc, IUserModel } from '@schemas';
import { model, Schema } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { logger, randomString } from '@utils';

const UserSchema = new Schema<IUserDoc>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        avatar: { type: String },
        password: { type: String },
        status: { type: String, enum: Object.values(Status), default: Status.ACTIVE },
        authTokenIssuedAt: { type: Number, default: 0 },
        failedAttempts: { type: Number, default: 0 },
        firstFailedAt: { type: Date },
        lockUntil: { type: Number, default: 0 },
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

UserSchema.pre<IUserDoc>('save', async function (next) {
    try {
        if (!this.password) {
            const generatedPassword = randomString();
            this.password = generatedPassword;
        }
        if (this.password && this.isModified('password')) {
            const saltRounds = Number(process.env.BCRYPT_ITERATIONS || 10);
            this.password = await hash(this.password, saltRounds);
        }
        return next();
    } catch (e) {
        logger.error('User model error in pre save hook', e);
        return next();
    }
});

UserSchema.method('comparePassword', async function comparePassword(password: string) {
    try {
        if (!this.password) {
            return false;
        }
        return compare(password, this.password);
    } catch (e) {
        logger.error('User model error in comparePassword', e);
        return false;
    }
});

export const User = model<IUserDoc, IUserModel>('User', UserSchema, 'users');
