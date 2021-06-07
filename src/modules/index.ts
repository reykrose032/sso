import TodoResolver from "./todo/resolver";
import UserResolver from "./user/resolver";

// Important: Add all your module's resolver in this
export const resolvers: [Function, ...Function[]] = [
  TodoResolver,
  UserResolver
  // AuthResolver
  // ...
];
