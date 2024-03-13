import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
} from 'typeorm';
import { TasksService } from 'src/tasks/tasks.service';
import ms from 'ms';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PasswordResetTokenEntity } from './password-reset.entity';

@Injectable()
@EventSubscriber()
export class PasswordResetSubscriber
  implements EntitySubscriberInterface<PasswordResetTokenEntity>
{
  constructor(
    connection: DataSource,
    private readonly tasksService: TasksService,
    private configService: ConfigService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return PasswordResetTokenEntity;
  }

  async beforeInsert(
    event: InsertEvent<PasswordResetTokenEntity>,
  ): Promise<void> {
    const expiresAfter = ms(
      this.configService.get<string>('PASSWORD_RESET_TOKEN_EXPIRATION'),
    );
    await this.tasksService.scheduleDeleteExpiredPasswordResetToken(
      event.entity,
      expiresAfter,
    );
  }
}
