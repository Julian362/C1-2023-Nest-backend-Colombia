import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { DataRangeDTO, DepositDTO, PaginationDTO } from 'src/business/dtos';
import { DepositService } from '../../../business/services';
import { DepositEntity } from '../../../data/persistence/entities';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}
  @Post()
  async createDeposit(@Body() account: DepositDTO): Promise<DepositEntity> {
    return await this.depositService.createDeposit(account);
  }

  @Post('all')
  async GetAll(
    @Body()
    body: {
      accountId: string;
      pagination: PaginationDTO;
      dataRange?: DataRangeDTO;
    },
  ): Promise<DepositEntity[]> {
    return await this.depositService.getHistory(
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
