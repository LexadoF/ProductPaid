/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from '../../../domain/repository/transaction/transaction.repository';
import { IntegrationRepository } from '../../../domain/repository/integration/integration.repository';
import { CreateTransactionDto } from '../../../application/dtos/transactions.dto';
import { TransactionModel } from '../../../infrastructure/database/models/transaction.model';
import { TransactionStatus } from '../../../domain/enums/transaction.enum';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: TransactionRepository;
  let integrationRepository: IntegrationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useValue: {
            createTransaction: jest.fn(),
          },
        },
        {
          provide: IntegrationRepository,
          useValue: {
            createPaymentWP: jest.fn(),
            getLocalPaymentCrossReference: jest.fn(),
            checkPaymentStatusWP: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    integrationRepository = module.get<IntegrationRepository>(
      IntegrationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction and call external payment service', async () => {
    const createTransactionDto: CreateTransactionDto = {
      product_id: 1,
      product_ammount: 1,
      customer_email: 'test@example.com',
      card: {
        number: '4111111111111111',
        exp_month: '8',
        exp_year: '25',
        cvc: '123',
        card_holder: 'Test User',
      },
      customer_data: {
        phone_number: '123456789',
        full_name: 'Test User',
        legal_id: '1234567890',
        legal_id_type: 'ID',
      },
      shipping_address: {
        address_line_1: '123 Main St',
        country: 'CO',
        region: 'NA',
        city: 'Bogota',
        name: 'Test',
        phone_number: '123456789',
        postal_code: '111111',
      },
      installments: 1,
    };

    const mockTransactionModel: TransactionModel = {
      transactionNumber: 'txn123',
      subtotal: 1000,
      customer_id: 1,
      delivery_id: 1,
      id: 1,
      id_paymentService: 'txn123',
      product_ammount: 1,
      product_id: 1,
      status: TransactionStatus.PENDING,
    };

    jest
      .spyOn(transactionRepository, 'createTransaction')
      .mockResolvedValue(mockTransactionModel);
    const createPaymentWPspy = jest
      .spyOn(integrationRepository, 'createPaymentWP')
      .mockResolvedValue(undefined);

    const result = await service.createTransaction(
      createTransactionDto,
      'token',
    );

    expect(transactionRepository.createTransaction).toHaveBeenCalledWith(
      createTransactionDto,
      'token',
    );
    expect(integrationRepository.createPaymentWP).toHaveBeenCalledWith(
      mockTransactionModel.transactionNumber,
      createTransactionDto.customer_email,
      createTransactionDto.card,
      mockTransactionModel.subtotal,
      createTransactionDto.customer_data,
      createTransactionDto.shipping_address,
      createTransactionDto.installments,
    );
    expect(result).toEqual(mockTransactionModel);
  });

  it('should throw an error if createTransaction fails', async () => {
    const createTransactionDto: CreateTransactionDto = {
      product_id: 1,
      product_ammount: 1,
      customer_email: 'test@example.com',
      card: {
        number: '4111111111111111',
        exp_month: '8',
        exp_year: '25',
        cvc: '123',
        card_holder: 'Test User',
      },
      customer_data: {
        phone_number: '123456789',
        full_name: 'Test User',
        legal_id: '1234567890',
        legal_id_type: 'ID',
      },
      shipping_address: {
        address_line_1: '123 Main St',
        country: 'CO',
        region: 'NA',
        city: 'Bogota',
        name: 'Test',
        phone_number: '123456789',
        postal_code: '111111',
      },
      installments: 1,
    };

    jest
      .spyOn(transactionRepository, 'createTransaction')
      .mockRejectedValue(new Error('Error creating transaction'));

    await expect(
      service.createTransaction(createTransactionDto, 'token'),
    ).rejects.toThrow('Error creating transaction');
  });

  it('should check transaction status successfully', async () => {
    const transactionId = 'txn123';
    const localReference = 'txn123';
    const paymentStatus = 'APPROVED';

    jest
      .spyOn(integrationRepository, 'getLocalPaymentCrossReference')
      .mockResolvedValue(localReference);
    jest
      .spyOn(integrationRepository, 'checkPaymentStatusWP')
      .mockResolvedValue(paymentStatus);

    const result = await service.checkTransaction(transactionId);

    expect(
      integrationRepository.getLocalPaymentCrossReference,
    ).toHaveBeenCalledWith(transactionId);
    expect(integrationRepository.checkPaymentStatusWP).toHaveBeenCalledWith(
      localReference,
    );
    expect(result).toBe(paymentStatus);
  });

  it('should throw an error if getLocalPaymentCrossReference fails', async () => {
    const transactionId = 'txn123';
    jest
      .spyOn(integrationRepository, 'getLocalPaymentCrossReference')
      .mockRejectedValue(new Error('Error retrieving local reference'));

    await expect(service.checkTransaction(transactionId)).rejects.toThrow(
      'Error retrieving local reference',
    );
  });

  it('should throw an error if checkPaymentStatusWP fails', async () => {
    const transactionId = 'txn123';
    const localReference = 'local_ref';
    jest
      .spyOn(integrationRepository, 'getLocalPaymentCrossReference')
      .mockResolvedValue(localReference);
    jest
      .spyOn(integrationRepository, 'checkPaymentStatusWP')
      .mockRejectedValue(new Error('Error checking payment status'));

    await expect(service.checkTransaction(transactionId)).rejects.toThrow(
      'Error checking payment status',
    );
  });
});
