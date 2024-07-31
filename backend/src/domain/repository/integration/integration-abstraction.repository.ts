import {
  CardDto,
  CustomerDto,
  shippingDto,
} from '../../../application/dtos/transactions.dto';

export abstract class integrationAbstractionRepository {
  abstract createPaymentWP(
    transactionNumber: string,
    customerEmail: string,
    cartToDebit: CardDto,
    subtotal: number,
    customerData: CustomerDto,
    shippDetails: shippingDto,
    installments: number,
  ): Promise<void>;
  abstract checkPaymentStatusWP(externalTransactionId: string): Promise<void>;
}
