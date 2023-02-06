import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AccessTokenGuard } from "./access-token.guard";
import { Reflector } from "@nestjs/core";
import { AUTH_TYPE_KEY } from "../decorator/auth.decorator";
import { AuthType } from "../enum/auth-type.enum";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
    [AuthType.Baerer]: this.accessToken,
    [AuthType.None]: { canActivate: () => true }
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessToken: AccessTokenGuard
  ) {
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ?? [AuthType.Baerer];
    const guards = authTypes.map(type => this.authTypeGuardMap[type].flat());

    for (const g of guards) {
      const canActivate = await Promise.resolve(g.canActivate(context)).catch((err) => {
        throw new UnauthorizedException();
      });
    }

    return true;
  }
}
