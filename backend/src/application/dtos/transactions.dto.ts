import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CardDto {
  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(4)
  cvc: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  exp_month: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  exp_year: string;

  @IsNotEmpty()
  @IsString()
  card_holder: string;
}

export class CustomerDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('CO')
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  legal_id: string;

  @IsNotEmpty()
  @IsString()
  legal_id_type: string;
}

export class shippingDto {
  @IsString()
  @IsNotEmpty()
  address_line_1: string;

  @IsString()
  @IsOptional()
  address_line_2?: string;

  @IsString()
  @IsIn(['CO'])
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsIn(['Cundinamarca', 'Antioquia'])
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsIn(['Bogotá', 'Medellín'])
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('CO')
  phone_number: string;

  @IsString()
  @IsOptional()
  postal_code?: string;
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  product_ammount: number;

  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer_data: CustomerDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => shippingDto)
  shipping_address: shippingDto;

  @IsNotEmpty()
  @IsString()
  acceptance_token: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(36)
  installments: number;
}
