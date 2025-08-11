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

  async findAll(companyId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        companyId,
        deletedAt: null, // Soft delete kontrolü
      },
      include: {
        children: true, // Alt kategoriler
        parent: true,   // Üst kategori
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.findOne(id); // Varlığını kontrol et
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
