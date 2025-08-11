import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from '@prisma/client';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    return this.prisma.branch.create({ data: createBranchDto });
  }

  async findAll(companyId: string): Promise<Branch[]> {
    return this.prisma.branch.findMany({
      where: {
        companyId,
        deletedAt: null // Sadece silinmemiş şubeleri getir
      },
    });
  }

  async findOne(id: string): Promise<Branch | null> {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });
    if (!branch || branch.deletedAt !== null) { // Silinmişse veya yoksa
      throw new NotFoundException(`Branch with ID "${id}" not found.`);
    }
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    await this.findOne(id); // Şubenin varlığını ve aktifliğini kontrol et
    return this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
    });
  }

  async remove(id: string): Promise<Branch> {
    await this.findOne(id); // Şubenin varlığını ve aktifliğini kontrol et
    // Soft delete
    return this.prisma.branch.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
