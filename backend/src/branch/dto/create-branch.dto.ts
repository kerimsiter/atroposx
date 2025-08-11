import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  Min, Max, IsUrl, IsLatitude, IsLongitude,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  companyId: string; // Şirket ID'si zorunlu

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsString()
  serverIp?: string;

  @IsOptional()
  @IsNumber()
  @Min(1024)
  @Max(65535)
  @Type(() => Number)
  serverPort?: number;

  @IsOptional()
  @IsBoolean()
  isMainBranch?: boolean;

  @IsOptional()
  @IsString()
  openingTime?: string; // HH:mm formatında düşünebiliriz

  @IsOptional()
  @IsString()
  closingTime?: string; // HH:mm formatında düşünebiliriz

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  @Type(() => Number)
  workingDays?: number[]; // 1=Pazartesi, 7=Pazar

  @IsOptional()
  @IsString()
  cashRegisterId?: string;

  @IsOptional()
  @IsString()
  posTerminalId?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
