import { Status } from '@enums';
import { IGroupDoc, IGroupModel, ObjectId } from '@schemas';
import { model, Schema } from 'mongoose';

const GroupSchema = new Schema<IGroupDoc>(
    {
        name: { type: String, required: true, unique: true },
        creator: { type: ObjectId, required: true, ref: 'User' },
        members: [{ type: ObjectId, required: true, ref: 'User' }],
        description: { type: String, required: true },
        imageUrl: { type: String },
        status: { type: String, enum: Object.values(Status), default: Status.ACTIVE },
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

export const Group = model<IGroupDoc, IGroupModel>('Group', GroupSchema, 'groups');
