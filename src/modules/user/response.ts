import { Field, ObjectType } from "type-graphql";
import { MaxLength, MinLength } from "class-validator";
import { ObjectId } from 'mongodb';
import { prop } from "@typegoose/typegoose";

@ObjectType()
export class UserResponse {
    @Field()
    readonly _id!: ObjectId;

    @Field()
    @prop()
    name: string;
}
