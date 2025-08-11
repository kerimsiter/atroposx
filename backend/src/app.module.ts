import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { BranchModule } from './branch/branch.module';

@Module({
  imports: [PrismaModule, CompanyModule, BranchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
