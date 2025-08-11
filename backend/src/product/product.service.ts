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
        ...(categoryId && { categoryId }),
        deletedAt: null, // Soft delete kontrolü
      },
      include: {
        category: true, // Kategori bilgisi
        variants: true, // Varyantlar
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findOne(id); // Varlığını kontrol et
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
