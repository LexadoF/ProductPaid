import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { TransactionCreateUsecase } from '../../../application/useCases/transaction-create/transaction-create.usecase';
import { Request } from 'express';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionCreateUseCase: TransactionCreateUsecase) {}

  @UseGuards(AuthGuard)
  @Post('/buy')
  buyProduct(@Body() transaction: CreateTransactionDto, @Req() req: Request) {
    return this.transactionCreateUseCase.execute(
      transaction,
      req.headers.authorization.split(' ')[1],
    );
  }
}
