import { Resolver, Arg, Query, Mutation, UseMiddleware, Ctx } from "type-graphql";
import { Service } from "typedi";
import { ObjectId } from "mongodb";

import { User } from "../../entities";
import UserService from "./service";
import { NewUserInput } from "./input";
import { UserResponse } from "./response";
import { isAuth } from "../../utils/isAuth";
import { MyContext } from "../../utils/MyContext";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver((of) => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async getUser(@Arg('id') _id: ObjectId) {
    const user = await this.userService.getById(_id);

    return user;
  }

  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async me(
    @Ctx() { payload }: MyContext
  ): Promise<UserResponse> {
    let id = new ObjectId(payload?._id)
    const user = await this.userService.getById(id);
    if (!user)
      throw new Error('User does not exist')
    
    const { _id, name } = user;
    return { _id, name }
  }

  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Mutation(() => String)
  async login(
    @Arg('loginData') loginData: NewUserInput
  ): Promise<string> {
    return this.userService.login(loginData);
  }

  @Mutation(() => ObjectId)
  @UseMiddleware(isAuth)
  async createUser(
    @Arg('createUserData') createUserData: NewUserInput
  ): Promise<ObjectId> {
    return this.userService.addUser(createUserData);
  }
}
