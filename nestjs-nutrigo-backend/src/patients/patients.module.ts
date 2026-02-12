import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PatientsController } from './patients.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
