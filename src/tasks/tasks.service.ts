import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import {
  PasswordChangeTokenEntity,
  PasswordResetTokenEntity,
} from 'src/tokens/entities';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly tokensService: TokensService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron('0 * * * *')
  async clearExpiredTokens() {
    await this.tokensService.clearExpiredTokens();
    this.logger.log('Cleared all expired tokens');
  }

  async scheduleDeleteExpiredPasswordChangeToken(
    token: PasswordChangeTokenEntity,
    expiresAfter: number,
  ) {
    const callback = async () => {
      await this.tokensService.deletePasswordChangeToken(token);
    };

    const timeout = setTimeout(callback, expiresAfter);
    this.schedulerRegistry.addTimeout(
      `${token.token}_password_change_token`,
      timeout,
    );
  }

  async scheduleDeleteExpiredPasswordResetToken(
    token: PasswordResetTokenEntity,
    expiresAfter: number,
  ) {
    const callback = async () => {
      await this.tokensService.deletePasswordResetToken(token);
    };

    const timeout = setTimeout(callback, expiresAfter);
    this.schedulerRegistry.addTimeout(
      `${token.token}_password_reset_token`,
      timeout,
    );
  }
}
