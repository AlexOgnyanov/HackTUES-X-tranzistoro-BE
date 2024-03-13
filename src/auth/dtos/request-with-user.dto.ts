import { UserEntity } from 'src/user/entities';

export class RequestWithUser extends Request {
  user: UserEntity;
}
