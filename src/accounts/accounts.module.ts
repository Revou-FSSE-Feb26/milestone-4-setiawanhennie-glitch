import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { BalanceCalculatorService } from '../balance/balance-calculator.service';

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    {
      provide: BalanceCalculatorService,
      useFactory: () => new BalanceCalculatorService(),
    },
  ],
  exports: [AccountsService],
})
export class AccountsModule {}