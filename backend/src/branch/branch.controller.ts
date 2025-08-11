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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  // Şirket ID'sine göre tüm şubeleri listele
  @Get()
  findAll(@Query('companyId') companyId: string) {
    if (!companyId) {
      // Bir hata fırlatabilir veya boş liste dönebiliriz.
      // Şimdilik hata fırlatalım ki frontend bunu ele alsın.
      throw new Error('companyId query parameter is required.');
    }
    return this.branchService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }
}
