import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CardDto {
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
  @IsString()
  acceptance_token: string;
}
