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

import { PasswordChangeTokenEntity } from './password-change.entity';

@Injectable()
@EventSubscriber()
export class PasswordChangeSubscriber
  implements EntitySubscriberInterface<PasswordChangeTokenEntity>
{
  constructor(
    connection: DataSource,
    private readonly tasksService: TasksService,
    private configService: ConfigService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return PasswordChangeTokenEntity;
  }

  async beforeInsert(
    event: InsertEvent<PasswordChangeTokenEntity>,
  ): Promise<void> {
    const expiresAfter = ms(
      this.configService.get<string>('PASSWORD_CHANGE_TOKEN_EXPIRATION'),
    );
    await this.tasksService.scheduleDeleteExpiredPasswordChangeToken(
      event.entity,
      expiresAfter,
    );
  }
}
