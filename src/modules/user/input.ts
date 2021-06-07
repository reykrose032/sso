import { Field, InputType } from "type-graphql";
import { MaxLength, MinLength } from "class-validator";

@InputType()
export class NewUserInput {
  @Field()
  @MaxLength(300)
  @MinLength(1)
  name: string;

  @Field()
  @MinLength(3)
  password: string;
}
