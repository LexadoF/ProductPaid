import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationRepository } from './integration.repository';
import { DataSourceImpl } from '../../../infrastructure/database/typeorm.config';
import axios from 'axios';
import { appPubKey } from '../../../infrastructure/database/enviromental.config';
import { DataSource } from 'typeorm';

jest.mock('axios');

describe('IntegrationRepository', () => {
  const mockDataSourceImpl = {
    getDataSource: jest.fn().mockReturnValue({
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        save: jest.fn(),
      }),
      manager: {
        getRepository: jest.fn().mockReturnValue({
          findOne: jest.fn(),
        }),
      },
    }) as unknown as DataSource,
    baseUrlIntegration: 'https://mock-api-url.com/',
  };
  let repository: IntegrationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationRepository,
        {
          provide: DataSourceImpl,
          useValue: mockDataSourceImpl,
        },
      ],
    }).compile();

    repository = module.get<IntegrationRepository>(IntegrationRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createPaymentWP', () => {
    it('should call axios.post with correct parameters', async () => {
      const transactionNumber = 'txn_123';
      const customerEmail = 'customer@example.com';
      const cartToDebit = {
        number: '4111111111111111',
        cvc: '123',
        exp_month: '12',
        exp_year: '25',
        card_holder: 'John Doe',
      };
      const subtotal = 1000;
      const customerData = {
        phone_number: '1234567890',
        full_name: 'John Doe',
        legal_id: '123456789',
        legal_id_type: 'ID',
      };
      const shippDetails = {
        address_line_1: '123 Street',
        address_line_2: '',
        country: 'CO',
        region: 'Bogotá',
        city: 'Bogotá',
        name: 'John Doe',
        phone_number: '1234567890',
        postal_code: '110111',
      };
      const installments = 1;

      (axios.post as jest.Mock).mockResolvedValue({
        data: { data: { id: 'ext_txn_123' } },
      });

      await repository.createPaymentWP(
        transactionNumber,
        customerEmail,
        cartToDebit,
        subtotal,
        customerData,
        shippDetails,
        installments,
      );

      expect(axios.post).toHaveBeenCalledWith(
        `${mockDataSourceImpl.baseUrlIntegration}transactions`,
        expect.objectContaining({
          acceptance_token: expect.any(String),
          amount_in_cents: subtotal,
          currency: 'COP',
          signature: expect.any(String),
          customer_email: customerEmail,
          payment_method: {
            type: 'CARD',
            token: expect.any(String),
            installments,
          },
          reference: transactionNumber,
          customer_data: customerData,
          shipping_address: shippDetails,
        }),
        { headers: { Authorization: `Bearer ${appPubKey}` } },
      );
    });
  });
});
