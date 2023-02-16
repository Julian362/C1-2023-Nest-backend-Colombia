import { Body, Controller, Delete, Param, Post, Get } from '@nestjs/common';
import { DataRangeDTO, DepositDTO, PaginationDTO } from 'src/business/dtos';
import { DepositEntity } from '../../../data/persistence/entities';
import { DepositService } from '../../../business/services';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}
  @Post()
  createDeposit(@Body() account: DepositDTO): DepositEntity {
    return this.depositService.createDeposit(account);
  }

  @Post('all')
  GetAll(
    @Body()
    body: {
      accountId: string;
      pagination: PaginationDTO;
      dataRange?: DataRangeDTO;
    },
  ): DepositEntity[] {
    return this.depositService.getHistory(
      body.accountId,
      body.pagination,
      body.dataRange,
    );
  }

  @Delete(':id')
  deleteDeposit(@Param('id') id: string): void {
    this.depositService.deleteDeposit(id);
  }
}
