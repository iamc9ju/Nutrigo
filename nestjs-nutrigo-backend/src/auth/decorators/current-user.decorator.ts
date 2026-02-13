import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../interface/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    if (!isValidJwtPayload(user)) {
      throw new UnauthorizedException('Invalid user payload');
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);

function isValidJwtPayload(user: unknown): user is JwtPayload {
  return (
    typeof user === 'object' &&
    user !== null &&
    'sub' in user &&
    typeof (user as JwtPayload).sub === 'string' &&
    'email' in user &&
    typeof (user as JwtPayload).email === 'string' &&
    'role' in user &&
    typeof (user as JwtPayload).role === 'string'
  );
}
