import { PermissionAction, PermissionObject } from '../enums';

export type CaslPermission = {
  action: PermissionAction;
  subject: PermissionObject;
};
