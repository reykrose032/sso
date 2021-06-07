import { Resolver, Arg, Query, Mutation, ID } from "type-graphql";
import { Service } from "typedi";
import { ObjectId } from "mongodb";

import { User } from "../../entities";
import UserService from "./service";
import { NewUserInput } from "./input";
import { UserResponse } from "./response";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver((of) => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  async getUser(@Arg("id") id: ObjectId) {
    const user = await this.userService.getById(id);

    return user;
  }

  @Query(() => [User])
  async getAllUsers() {
      const users = await this.userService.getAllUsers();
      return users;
  }

  @Mutation(() => UserResponse)
  async authenticate(
    @Arg('authenticateData') authenticateData: NewUserInput
  ): Promise<UserResponse> {
    const user = await this.userService.authenticate(authenticateData);
    return user;
  }

  @Mutation((returns) => UserResponse)
  async createUser(
    @Arg("createUserData") createUserData: NewUserInput
  ): Promise<UserResponse> {
    const user = await this.userService.addUser(createUserData);
    return user;
  }
}
