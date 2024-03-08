import {Schema, model} from 'mongoose';

export interface IUser {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

export const UserModel = model<IUser>("users", UserSchema);