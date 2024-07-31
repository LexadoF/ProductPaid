import {
  CardDto,
  CustomerDto,
} from '../../../application/dtos/transactions.dto';

export abstract class integrationAbstractionRepository {
  abstract createPaymentWP(
    transactionNumber: string,
    delivery: number,
    cartToDebit: CardDto,
    acceptance_token: string,
    subtotal: number,
    customerData: CustomerDto,
    installments: number,
  ): Promise<any>;
  abstract checkPaymentStatus(): any;
}
