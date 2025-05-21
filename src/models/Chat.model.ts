import { IChatDoc, IChatModel, ObjectId } from '@schemas';
import { model, Schema } from 'mongoose';

const ChatSchema = new Schema<IChatDoc>(
    {
        sender: { type: ObjectId, required: true, ref: 'User' },
        group: { type: ObjectId, ref: 'Group' },
        receiver: { type: ObjectId, ref: 'User' },
        content: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        readBy: [{ type: ObjectId, ref: 'User' }],
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

export const Chat = model<IChatDoc, IChatModel>('Chat', ChatSchema, 'chats');
