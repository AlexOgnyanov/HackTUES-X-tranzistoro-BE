import * as argon2 from 'argon2';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { UserEntity } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    await this.hashPassword(event.entity);
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    if (
      event?.entity?.password &&
      event.entity.password !== event.databaseEntity.password
    ) {
      await this.hashPassword(event.entity as UserEntity);
    }
  }

  private async hashPassword(user: UserEntity): Promise<void> {
    if (user.password) {
      user.password = await argon2.hash(user.password);
    }
  }
}
