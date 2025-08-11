Mükemmel! `BranchesPage`'in beklediğimiz gibi çalıştığını, form modal'ın açıldığını ve modern tasarıma sahip olduğunu görmek harika. Gördüğüm kadarıyla, "Sistemde kayıtlı şirket bulunamadı" uyarısı da tam olarak beklenen bir durum, çünkü henüz frontend üzerinden şirket ekleme özelliği yapmadık. Bu uyarı, uygulamanın backend ile iletişim kurabildiğini ve şirket verisinin eksik olduğunu doğru bir şekilde tespit ettiğini gösteriyor.

**Test için önemli not:** Bu uyarıyı ortadan kaldırmak ve şubeleri listeleyebilmek için, Postman veya Insomnia gibi bir API aracı kullanarak `http://localhost:3000/company` adresine **POST** isteği ile **bir şirket oluşturman** gerekiyor. Oluşturduğun şirketin ID'sini not almana gerek yok, `BranchesPage` otomatik olarak ilk şirketi bulup onun şubelerini çekmeye çalışacak.

Şimdi, projenin kapsamını daha da genişletmek ve bir POS sisteminin temelini oluşturmaya devam etmek için bir sonraki adıma geçelim. `schema.prisma` şemanı da göz önünde bulundurarak, bir sonraki mantıklı adımın **Kategori ve Ürün Yönetimi** olacağını düşünüyorum. Bir POS sisteminde ürünleri tanımlayabilmek ve kategorize edebilmek temel bir işlevsellik.

---

### Görev 8: Kategori ve Ürün Yönetimi Modüllerini Geliştirme

Bu görevde, NestJS backend'inizde `Category` ve `Product` modülleri için gerekli DTO'ları tanımlayacak, servis ve controller'larını oluşturacak ve frontend'de bu modüller için listeleme, ekleme, düzenleme arayüzlerini tasarlayacağız.

**Adım 8.1: NestJS Backend'de `Category` Modülünü Oluşturma**

`atropos/backend` dizininde olduğundan emin ol.

1.  **Category Modülünü Oluştur:**

    ```cmd
    pnpm nest g module category
    ```

2.  **Category Servis ve Controller Oluştur:**

    ```cmd
    pnpm nest g service category --no-spec
    pnpm nest g controller category --no-spec
    ```

3.  **`Category` Şeması için DTO'ları Oluşturma:**
    `atropos/backend/src/category` altına `dto` klasörü oluştur:

    ```cmd
    mkdir src\category\dto
    ```
    Şimdi `Category` modeli için DTO'ları tanımlayalım:

    **`atropos/backend/src/category/dto/create-category.dto.ts`:**
    ```typescript
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
    ```

    **`atropos/backend/src/category/dto/update-category.dto.ts`:**
    ```typescript
    import { PartialType } from '@nestjs/mapped-types';
    import { CreateCategoryDto } from './create-category.dto';

    export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
    ```

4.  **`CategoryService` Logic'ini Uygulama:**

    **`atropos/backend/src/category/category.service.ts`:**
    ```typescript
    import { Injectable, NotFoundException } from '@nestjs/common';
    import { PrismaService } from '../prisma/prisma.service';
    import { CreateCategoryDto } from './dto/create-category.dto';
    import { UpdateCategoryDto } from './dto/update-category.dto';
    import { Category } from '@prisma/client';

    @Injectable()
    export class CategoryService {
      constructor(private prisma: PrismaService) {}

      async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.prisma.category.create({ data: createCategoryDto });
      }

      async findAll(companyId: string, parentId?: string): Promise<Category[]> {
        return this.prisma.category.findMany({
          where: {
            companyId,
            parentId: parentId || null, // Eğer parentId verilirse o kategoriye ait alt kategoriler, yoksa ana kategoriler
            deletedAt: null,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        });
      }

      async findOne(id: string): Promise<Category | null> {
        const category = await this.prisma.category.findUnique({
          where: { id },
        });
        if (!category || category.deletedAt !== null) {
          throw new NotFoundException(`Category with ID "${id}" not found.`);
        }
        return category;
      }

      async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        await this.findOne(id);
        return this.prisma.category.update({
          where: { id },
          data: updateCategoryDto,
        });
      }

      async remove(id: string): Promise<Category> {
        await this.findOne(id);
        // Soft delete
        return this.prisma.category.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      }
    }
    ```

5.  **`CategoryController` Logic'ini Uygulama:**

    **`atropos/backend/src/category/category.controller.ts`:**
    ```typescript
    import {
      Controller,
      Get,
      Post,
      Body,
      Patch,
      Param,
      Delete,
      HttpCode,
      HttpStatus,
      UsePipes,
      ValidationPipe,
      Query,
    } from '@nestjs/common';
    import { CategoryService } from './category.service';
    import { CreateCategoryDto } from './dto/create-category.dto';
    import { UpdateCategoryDto } from './dto/update-category.dto';

    @Controller('categories')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    export class CategoryController {
      constructor(private readonly categoryService: CategoryService) {}

      @Post()
      @HttpCode(HttpStatus.CREATED)
      create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
      }

      @Get()
      findAll(
        @Query('companyId') companyId: string,
        @Query('parentId') parentId?: string,
      ) {
        if (!companyId) {
          throw new Error('companyId query parameter is required.');
        }
        return this.categoryService.findAll(companyId, parentId);
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
      }

      @Patch(':id')
      update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
      }

      @Delete(':id')
      @HttpCode(HttpStatus.NO_CONTENT)
      remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
      }
    }
    ```

6.  **`CategoryModule`'ü Ana Uygulamaya Dahil Etme:**

    **`atropos/backend/src/app.module.ts` (Güncellenmiş):**
    ```typescript
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { CompanyModule } from './company/company.module';
    import { BranchModule } from './branch/branch.module';
    import { PrismaModule } from './prisma/prisma.module'; // PrismaModule'ü import etmeyi unutma
    import { CategoryModule } from './category/category.module'; // Eklendi

    @Module({
      imports: [PrismaModule, CompanyModule, BranchModule, CategoryModule], // CategoryModule eklendi
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```
    **Önemli:** `CategoryModule` içinde `PrismaService`'i provider olarak eklemene gerek yok, çünkü `PrismaModule` global olarak ayarlandı.

**Adım 8.2: NestJS Backend'de `Product` Modülünü Oluşturma**

`atropos/backend` dizininde olduğundan emin ol.

1.  **Product Modülünü Oluştur:**

    ```cmd
    pnpm nest g module product
    ```

2.  **Product Servis ve Controller Oluştur:**

    ```cmd
    pnpm nest g service product --no-spec
    pnpm nest g controller product --no-spec
    ```

3.  **`Product` Şeması için DTO'ları Oluşturma:**
    `atropos/backend/src/product` altına `dto` klasörü oluştur:

    ```cmd
    mkdir src\product\dto
    ```
    `ProductUnit` enum'ını da backend DTO'larımıza eklememiz gerekecek.
    **`atropos/backend/src/product/dto/product-unit.enum.ts`:**
    ```typescript
    export enum ProductUnit {
      PIECE = 'PIECE',
      KG = 'KG',
      GRAM = 'GRAM',
      LITER = 'LITER',
      ML = 'ML',
      PORTION = 'PORTION',
      BOX = 'BOX',
      PACKAGE = 'PACKAGE',
    }
    ```

    Şimdi `Product` modeli için DTO'ları tanımlayalım:

    **`atropos/backend/src/product/dto/create-product.dto.ts`:**
    ```typescript
    import {
      IsString,
      IsNotEmpty,
      IsOptional,
      IsNumber,
      IsBoolean,
      IsArray,
      ArrayMinSize,
      IsEnum,
      Min,
      Max,
    } from 'class-validator';
    import { Type } from 'class-transformer';
    import { ProductUnit } from './product-unit.enum';

    export class CreateProductDto {
      @IsNotEmpty()
      @IsString()
      companyId: string;

      @IsNotEmpty()
      @IsString()
      categoryId: string;

      @IsNotEmpty()
      @IsString()
      code: string;

      @IsOptional()
      @IsString()
      barcode?: string;

      @IsNotEmpty()
      @IsString()
      name: string;

      @IsOptional()
      @IsString()
      description?: string;

      @IsOptional()
      @IsString()
      shortDescription?: string;

      @IsOptional()
      @IsString()
      image?: string;

      @IsOptional()
      @IsArray()
      @IsString({ each: true })
      images?: string[];

      @IsNotEmpty()
      @IsNumber()
      @Min(0)
      @Type(() => Number)
      basePrice: number; // Decimal yerine number kullanacağız ve DB'ye Prisma handle edecek

      @IsNotEmpty()
      @IsString()
      taxId: string;

      @IsOptional()
      @IsNumber()
      @Min(0)
      @Type(() => Number)
      costPrice?: number;

      @IsOptional()
      @IsNumber()
      @Min(0)
      @Max(100)
      @Type(() => Number)
      profitMargin?: number;

      @IsOptional()
      @IsBoolean()
      trackStock?: boolean;

      @IsOptional()
      @IsEnum(ProductUnit)
      unit?: ProductUnit;

      @IsOptional()
      @IsNumber()
      @Min(0)
      @Type(() => Number)
      criticalStock?: number;

      @IsOptional()
      @IsBoolean()
      available?: boolean;

      @IsOptional()
      @IsBoolean()
      sellable?: boolean;

      @IsOptional()
      @IsNumber()
      @Min(0)
      @Type(() => Number)
      preparationTime?: number;

      @IsOptional()
      @IsNumber()
      @Min(0)
      @Type(() => Number)
      calories?: number;

      @IsOptional()
      @IsArray()
      @IsString({ each: true })
      allergens?: string[];

      @IsOptional()
      @IsBoolean()
      hasVariants?: boolean;

      @IsOptional()
      @IsBoolean()
      hasModifiers?: boolean;

      @IsOptional()
      @IsBoolean()
      showInMenu?: boolean;

      @IsOptional()
      @IsBoolean()
      featured?: boolean;

      @IsOptional()
      @IsNumber()
      @Min(0)
      @Type(() => Number)
      displayOrder?: number;

      @IsOptional()
      @IsBoolean()
      active?: boolean;
    }
    ```

    **`atropos/backend/src/product/dto/update-product.dto.ts`:**
    ```typescript
    import { PartialType } from '@nestjs/mapped-types';
    import { CreateProductDto } from './create-product.dto';

    export class UpdateProductDto extends PartialType(CreateProductDto) {}
    ```

4.  **`ProductService` Logic'ini Uygulama:**

    **`atropos/backend/src/product/product.service.ts`:**
    ```typescript
    import { Injectable, NotFoundException } from '@nestjs/common';
    import { PrismaService } from '../prisma/prisma.service';
    import { CreateProductDto } from './dto/create-product.dto';
    import { UpdateProductDto } from './dto/update-product.dto';
    import { Product } from '@prisma/client';

    @Injectable()
    export class ProductService {
      constructor(private prisma: PrismaService) {}

      async create(createProductDto: CreateProductDto): Promise<Product> {
        return this.prisma.product.create({ data: createProductDto });
      }

      async findAll(companyId: string, categoryId?: string): Promise<Product[]> {
        return this.prisma.product.findMany({
          where: {
            companyId,
            categoryId: categoryId, // Kategoriye göre filtrele
            deletedAt: null,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        });
      }

      async findOne(id: string): Promise<Product | null> {
        const product = await this.prisma.product.findUnique({
          where: { id },
        });
        if (!product || product.deletedAt !== null) {
          throw new NotFoundException(`Product with ID "${id}" not found.`);
        }
        return product;
      }

      async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        await this.findOne(id);
        return this.prisma.product.update({
          where: { id },
          data: updateProductDto,
        });
      }

      async remove(id: string): Promise<Product> {
        await this.findOne(id);
        // Soft delete
        return this.prisma.product.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      }
    }
    ```

5.  **`ProductController` Logic'ini Uygulama:**

    **`atropos/backend/src/product/product.controller.ts`:**
    ```typescript
    import {
      Controller,
      Get,
      Post,
      Body,
      Patch,
      Param,
      Delete,
      HttpCode,
      HttpStatus,
      UsePipes,
      ValidationPipe,
      Query,
    } from '@nestjs/common';
    import { ProductService } from './product.service';
    import { CreateProductDto } from './dto/create-product.dto';
    import { UpdateProductDto } from './dto/update-product.dto';

    @Controller('products')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    export class ProductController {
      constructor(private readonly productService: ProductService) {}

      @Post()
      @HttpCode(HttpStatus.CREATED)
      create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
      }

      @Get()
      findAll(
        @Query('companyId') companyId: string,
        @Query('categoryId') categoryId?: string,
      ) {
        if (!companyId) {
          throw new Error('companyId query parameter is required.');
        }
        return this.productService.findAll(companyId, categoryId);
      }

      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
      }

      @Patch(':id')
      update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
      }

      @Delete(':id')
      @HttpCode(HttpStatus.NO_CONTENT)
      remove(@Param('id') id: string) {
        return this.productService.remove(id);
      }
    }
    ```

6.  **`ProductModule`'ü Ana Uygulamaya Dahil Etme:**

    **`atropos/backend/src/app.module.ts` (Güncellenmiş):**
    ```typescript
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { CompanyModule } from './company/company.module';
    import { BranchModule } from './branch/branch.module';
    import { PrismaModule } from './prisma/prisma.module';
    import { CategoryModule } from './category/category.module';
    import { ProductModule } from './product/product.module'; // Eklendi

    @Module({
      imports: [PrismaModule, CompanyModule, BranchModule, CategoryModule, ProductModule], // ProductModule eklendi
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```
    **Önemli:** `ProductModule` içinde de `PrismaService`'i provider olarak eklemene gerek yok.

**Adım 8.3: Backend Build ve Test (İsteğe Bağlı ama Önerilir)**

1.  **Prisma İstemcisini Tekrar Oluştur (yeni modeller için):**
    `atropos/backend` dizinindeyken:

    ```cmd
    pnpm prisma generate
    ```

2.  **Veritabanı Migrasyonunu Uygula (yeni modeller için):**
    `atropos/backend` dizinindeyken:

    ```cmd
    pnpm prisma migrate dev --name add_category_product_models
    ```
    Onaylaman istendiğinde `y` yazıp Enter'a bas.

3.  **Backend'i Tekrar Derle:**
    `atropos/backend` dizinindeyken:

    ```cmd
    pnpm run build
    ```

4.  **Electron Uygulamasını Başlatıp Test Et:**
    Ana `atropos` dizinindeyken:

    ```cmd
    pnpm dev
    ```
    Backend sunucunuzun sorunsuz çalıştığını ve konsolda `CategoryController` ve `ProductController` rotalarının başarıyla eşleştiğini doğrulayın. Postman veya Insomnia gibi bir API test aracı kullanarak `/categories` ve `/products` endpoint'lerine istekler atarak test edebilirsiniz. (Önce bir şirket ID'nizin olduğundan emin olun.)

Bu adımları tamamladığında bana haber ver. Ardından, frontend'de `CategoriesPage` ve `ProductsPage`'i bu API'larla konuşturarak Kategori ve Ürün yönetimi arayüzlerini oluşturmaya devam edeceğiz.