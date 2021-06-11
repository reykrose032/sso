import { Service } from "typedi";
import { ObjectId } from "mongodb";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import UserModel from "./model";
import { User } from "../../entities";
import { NewUserInput } from "./input";
import { UserResponse } from "./response";

@Service() // Dependencies injection
export default class UserService {
  constructor(private readonly userModel: UserModel) { }

  public async getById(_id: ObjectId): Promise<User | null> {
    return this.userModel.getById(_id);
  }

  public async getAllUsers(): Promise<User[] | null> {
    return this.userModel.getAll();
  }

  public async addUser(input: NewUserInput): Promise<ObjectId> {
    const { name, password } = input;
    const userFromDB = await this.userModel.getByName(name);
    if (userFromDB)
      throw new Error('Username taken');

    const saltPassword = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, saltPassword);
    return this.userModel.create(name, saltPassword, hashPassword);
  }

  public async login(authInput: NewUserInput): Promise<string> {
    const { name, password } = authInput;
    const userFromDB = await this.userModel.getByName(name);

    if (!userFromDB)
      throw new Error('User not found');

    const { hashPassword, _id } = userFromDB;

    if (!await bcrypt.compare(password, hashPassword))
      throw new Error('Wrong password');

    return jwt.sign({ _id }, 'f1BtnWgD3VKY', { expiresIn: '1d' });
  }
}
