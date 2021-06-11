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
    
    async getByName(name: string): Promise<User | null> {
        return UserMongooseModel.findOne({ name }).lean().exec();
    }

    async getAll(): Promise<User[] | null> {
        return UserMongooseModel.find().lean().exec();
    }

    async create(name: string, saltPassword: string, hashPassword: string): Promise<ObjectId> {
        const user = new UserMongooseModel({ name, saltPassword, hashPassword });
        const { _id } = await user.save();
        return _id;
    }
}