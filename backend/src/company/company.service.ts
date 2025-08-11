import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '../../generated/prisma';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.prisma.company.create({ data: createCompanyDto });
  }

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      where: {
        deletedAt: null // Only return non-deleted companies
      }
    });
  }

  async findOne(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({ 
      where: { id, deletedAt: null } 
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string): Promise<Company> {
    // Soft delete
    return this.prisma.company.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findActiveCompany(): Promise<Company | null> {
    return this.prisma.company.findFirst({
      where: {
        deletedAt: null // Only return non-deleted companies
      }
    });
  }
}
