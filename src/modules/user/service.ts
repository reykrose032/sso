import { Service } from "typedi";
import { ObjectId } from "mongodb";

import UserModel from "./model";
import { User } from "../../entities";
import { NewUserInput } from "./input";
import { UserResponse } from "./response";

@Service() // Dependencies injection
export default class TodoService {
  constructor(private readonly userModel: UserModel) {}

  public async getById(_id: ObjectId): Promise<User | null> {
    return this.userModel.getById(_id);
  }

  public async getAllUsers(): Promise<User[] | null> {
      return this.userModel.getAll();
  }

  public async addUser(input: NewUserInput): Promise<UserResponse> {
    const newUser = await this.userModel.create(input);

    // Business logic goes here
    // Example:
    // Trigger push notification, analytics, ...

    return newUser;
  }

  public async authenticate(authInput: NewUserInput): Promise<UserResponse> {
    return this.userModel.authenticate(authInput);
  }
}
