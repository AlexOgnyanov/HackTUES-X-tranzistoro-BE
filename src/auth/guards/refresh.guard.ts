import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthErrorCodes } from '../errors';

export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof Error) {
      throw new UnauthorizedException(AuthErrorCodes.InvalidRefreshTokenError);
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
