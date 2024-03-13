import { Injectable } from '@nestjs/common';
import { PureAbility } from '@casl/ability';
import { UserEntity } from 'src/user/entities';

import { AppAbility, CaslPermission } from './types';
import { PermissionAction, PermissionObject } from './enums';

@Injectable()
export class CaslAbilityFactory {
  async createForUser(user: UserEntity): Promise<AppAbility> {
    const dbPermissions = user.role?.permissions;

    const caslPermissions: CaslPermission[] = dbPermissions?.map((p) => ({
      action: p.action,
      subject: p.object,
    }));

    return new PureAbility<[PermissionAction, PermissionObject]>(
      caslPermissions,
    );
  }
}
