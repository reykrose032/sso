import { getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';

import { User } from '../../entities/user';
import { NewUserInput } from './input';
import { UserResponse } from './response';

export const UserMongooseModel = getModelForClass(User);

export default class UserModel {
    async getById(_id: ObjectId): Promise<User | null> {
        return UserMongooseModel.findById(_id).lean().exec();
    }

    async getAll(): Promise<User[] | null> {
        return UserMongooseModel.find().lean().exec();
    }

    async authenticate(authInput: NewUserInput): Promise<UserResponse> {
        const { name, password } = authInput;
        const userFromDB = await UserMongooseModel.findOne({ name }).lean().exec();

        if (!userFromDB)
            throw new Error('User not found');
        
        const { hashPassword, _id, token } = userFromDB;

        if (!await bcrypt.compare(password, hashPassword))
            throw new Error('Wrong password');

        return { _id, name, token };
    }

    async create(input: NewUserInput): Promise<UserResponse> {
        const { name, password } = input;
        const userFromDB = await UserMongooseModel.findOne({ name }).lean().exec();
        if (userFromDB)
            throw new Error('Username taken');

        const saltPassword = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, saltPassword);
        const token = await bcrypt.hash(String(Date.now()), saltPassword);
        const user = new UserMongooseModel({ name, saltPassword, hashPassword, token });

        const { _id } = await user.save();

        return { _id, name, token };
    }
}