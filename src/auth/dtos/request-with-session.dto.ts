import { SessionEntity } from '../entities';

export class RequestWithSession extends Request {
  user: {
    session: SessionEntity;
  };
}
