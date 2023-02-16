import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DataRangeDTO, PaginationDTO, TransferDTO } from 'src/business/dtos';
import { TransferEntity } from '../../../data/persistence/entities';
import { TransferService } from '../../../business/services';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  createTransfer(@Body() transfer: TransferDTO): TransferEntity {
    return this.transferService.createTransfer(transfer);
  }

  @Get('/select/:id')
  selectTransfer(@Param('id') id: string): TransferEntity {
    return this.transferService.selectTransfer(id);
  }

  @Delete(':id')
  deleteTransfer(@Param('id') id: string): TransferEntity {
    const transfer = this.transferService.selectTransfer(id);
    this.transferService.deleteTransfer(id);
    return transfer;
  }

  @Post('income')
  getHistoryIn(
    @Body()
    body: {
      accountId: string;
      pagination: PaginationDTO;
      dataRange?: DataRangeDTO;
    },
  ): TransferEntity[] {
    return this.transferService.getHistoryIn(
      body.accountId,
      body.pagination,
      body.dataRange,
    );
  }

  @Post('outcome')
  getHistoryOut(
    @Body()
    body: {
      accountId: string;
      pagination: PaginationDTO;
      dataRange?: DataRangeDTO;
    },
  ): TransferEntity[] {
    return this.transferService.getHistoryOut(
      body.accountId,
      body.pagination,
      body.dataRange,
    );
  }

  @Post('history')
  getHistory(
    @Body()
    body: {
      accountId: string;
      pagination: PaginationDTO;
      dataRange?: DataRangeDTO;
    },
  ): TransferEntity[] {
    return this.transferService.getHistory(
      body.accountId,
      body.pagination,
      body.dataRange,
    );
  }
}
