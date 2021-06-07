import { ObjectType, Field } from "type-graphql";
import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

@ObjectType()
export class User {
  @Field()
  readonly _id!: ObjectId;

  @prop()
  @Field()
  name!: string;

  @prop()
  @Field()
  hashPassword!: string;
  
  @prop()
  @Field()
  saltPassword!: string;

  @prop()
  @Field()
  token!: string;
}
