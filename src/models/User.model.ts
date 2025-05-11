import { Status } from '@enums';
import { IUserDoc, IUserModel } from '@schemas';
import { model, Schema, UpdateQuery } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { logger } from '@utils';
import moment from 'moment-timezone';

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
        passwordChangedAt: { type: Number },
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
        if (this.password && this.isModified('password')) {
            const saltRounds = Number(process.env.BCRYPT_ITERATIONS ?? 10);
            this.password = await hash(this.password, saltRounds);
        }
        return next();
    } catch (e) {
        logger.error('User model error in pre save hook', e);
        return next();
    }
});

UserSchema.pre<IUserDoc>('findOneAndUpdate', async function (next) {
    try {
        const self = this as UpdateQuery<IUserDoc>;
        const password = self.getUpdate().$set.password;

        if (password) {
            const saltRounds = Number(process.env.BCRYPT_ITERATIONS ?? 10);
            const hashedPassword = await hash(password, saltRounds);
            this.set('password', hashedPassword);
            this.set('passwordChangedAt', moment().unix());
        }

        return next();
    } catch (e) {
        logger.error('User model error in pre update hook', e);
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
