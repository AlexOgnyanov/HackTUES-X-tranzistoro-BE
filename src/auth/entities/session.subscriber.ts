import * as argon2 from 'argon2';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { SessionEntity } from './session.entity';

@EventSubscriber()
export class SessionSubscriber
  implements EntitySubscriberInterface<SessionEntity>
{
  listenTo() {
    return SessionEntity;
  }

  async beforeInsert(event: InsertEvent<SessionEntity>): Promise<void> {
    await this.hashRefreshToken(event.entity);
  }

  async beforeUpdate(event: UpdateEvent<SessionEntity>): Promise<void> {
    if (
      event?.entity?.refreshToken &&
      event.entity.refreshToken !== event.databaseEntity?.refreshToken
    ) {
      await this.hashRefreshToken(event.entity as SessionEntity);
    }
  }

  private async hashRefreshToken(user: SessionEntity): Promise<void> {
    if (user.refreshToken) {
      user.refreshToken = await argon2.hash(user.refreshToken);
    }
  }
}
