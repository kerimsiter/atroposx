import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [CompanyModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
