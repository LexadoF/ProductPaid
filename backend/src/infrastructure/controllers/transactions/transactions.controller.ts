import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { TransactionCreateUsecase } from '../../../application/useCases/transaction-create/transaction-create.usecase';
import { Request } from 'express';
import { CheckTransactionStatusUsecase } from '../../../application/useCases/check-transaction-status/check-transaction-status.usecase';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionCreateUseCase: TransactionCreateUsecase,
    private transactionCheckStatusUseCase: CheckTransactionStatusUsecase,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/buy')
  buyProduct(@Body() transaction: CreateTransactionDto, @Req() req: Request) {
    return this.transactionCreateUseCase.execute(
      transaction,
      req.headers.authorization.split(' ')[1],
    );
  }

  @UseGuards(AuthGuard)
  @Get('/checkStatus/:transactionId')
  checkStatus(@Param('transactionId') transactionId: string) {
    return this.transactionCheckStatusUseCase.execute(transactionId);
  }
}
