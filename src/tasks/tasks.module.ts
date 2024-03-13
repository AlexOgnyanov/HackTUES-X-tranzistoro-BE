import { Module, forwardRef } from '@nestjs/common';
import { TokensModule } from 'src/tokens/tokens.module';

import { TasksService } from './tasks.service';

@Module({
  imports: [forwardRef(() => TokensModule)],
  controllers: [],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
