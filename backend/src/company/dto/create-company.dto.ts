import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  taxNumber: string;

  @IsNotEmpty()
  @IsString()
  taxOffice: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  eArchiveUsername?: string;

  @IsOptional()
  @IsString()
  eArchivePassword?: string;

  @IsOptional()
  @IsString()
  eInvoiceUsername?: string;

  @IsOptional()
  @IsString()
  eInvoicePassword?: string;

  @IsOptional()
  @IsString()
  smsProvider?: string;

  @IsOptional()
  @IsString()
  smsApiKey?: string;

  @IsOptional()
  @IsString()
  smsApiSecret?: string;

  @IsOptional()
  @IsString()
  smsSenderName?: string;
}
