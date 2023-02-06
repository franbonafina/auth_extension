import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ActiveUserData } from "../../interfaces/active-user.interface";

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const req = xtx.switchToHttp().getRequest();
    const user = req["user"];

    return field ? user?.[field] : user;
  });