export enum AuthErrorCodes {
  UserWithThisEmailWasNotFoundError = 'USER_WITH_THIS_EMAIL_WAS_NOT_FOUND_ERROR',
  IncorrectPasswordError = 'INCORRECT_PASSWORD_ERROR',
  UserNotFoundError = 'USER_NOT_FOUND_ERROR',
  RoleNameAlreadyExistsError = 'ROLE_NAME_ALREADY_EXISTS_ERROR',
  PermissionNotFoundError = 'PERMISSION_NOT_FOUND_ERROR',
  PermissionExistsError = 'PERMISSION_EXISTS_ALREADY_ERROR',
  RoleNotFoundError = 'ROLE_NOT_FOUND_ERROR',
  AccountNotVerifiedError = 'ACCOUNT_NOT_VERIFIED_ERROR',
  InvalidRefreshTokenError = 'INVALID_REFRESH_TOKEN_ERROR',
  SessionNotFoundError = 'SESSION_NOT_FOUND_ERROR',
}
