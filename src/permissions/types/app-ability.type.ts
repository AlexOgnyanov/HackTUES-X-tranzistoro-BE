import { PureAbility } from '@casl/ability';

import { PermissionAction, PermissionObject } from '../enums';

export type AppAbility = PureAbility<[PermissionAction, PermissionObject]>;
