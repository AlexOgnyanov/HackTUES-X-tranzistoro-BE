import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from 'src/tasks/tasks.module';

import { TokensService } from './tokens.service';
import {
  PasswordResetTokenEntity,
  PasswordChangeTokenEntity,
  EmailConfirmationTokenEntity,
} from './entities';
import { PasswordChangeSubscriber } from './entities/password-change.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PasswordResetTokenEntity,
      PasswordChangeTokenEntity,
      EmailConfirmationTokenEntity,
    ]),
    forwardRef(() => TasksModule),
  ],
  providers: [TokensService, PasswordChangeSubscriber],
  exports: [TokensService],
})
export class TokensModule {}
