import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from 'src/permissions/casl-ability.factory';
import { RequiredPermission, AppAbility } from 'src/permissions/types';

import { RequestWithUser } from '../dtos';
import { PERMISSION_CHECKER_KEY } from '../constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        PERMISSION_CHECKER_KEY,
        context.getHandler(),
      ) || [];

    const req: RequestWithUser = context.switchToHttp().getRequest();
    const ability = await this.abilityFactory.createForUser(req.user);

    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission),
    );
  }

  private isAllowed(
    ability: AppAbility,
    permission: RequiredPermission,
  ): boolean {
    return ability.can(...permission);
  }
}
