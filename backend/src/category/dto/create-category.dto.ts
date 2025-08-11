import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  companyId: string; // Hangi şirkete ait olduğu

  @IsOptional()
  @IsString()
  parentId?: string; // Alt kategori ise üst kategori ID'si

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string; // Resim URL'i

  @IsOptional()
  @IsString()
  color?: string; // Hex kodu veya renk adı

  @IsOptional()
  @IsString()
  icon?: string; // İkon sınıfı veya URL'i

  @IsOptional()
  @IsBoolean()
  showInKitchen?: boolean; // Mutfak ekranında gösterilsin mi

  @IsOptional()
  @IsNumber()
  @Min(0)
  preparationTime?: number; // Dakika

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number; // Görüntülenme sırası

  @IsOptional()
  @IsBoolean()
  active?: boolean; // Aktif mi

  @IsOptional()
  @IsBoolean()
  showInMenu?: boolean; // QR menüde gösterilsin mi

  @IsOptional()
  @IsString()
  printerGroupId?: string; // Hangi yazıcı grubuna ait
}
