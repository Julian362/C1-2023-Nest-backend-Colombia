import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DataRangeDTO, PaginationDTO, TransferDTO } from 'src/business/dtos';
import { GuardsGuard } from 'src/presentation/guards/guards.guard';
import { TransferService } from '../../../business/services';
import { TransferEntity } from '../../../data/persistence/entities';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @UseGuards(GuardsGuard)
  async createTransfer(@Body() transfer: TransferDTO): Promise<TransferEntity> {
    return this.transferService.createTransfer(transfer);
  }

  @Get('/select/:id')
  @UseGuards(GuardsGuard)
  async selectTransfer(@Param('id') id: string): Promise<TransferEntity> {
    return this.transferService.selectTransfer(id);
  }

  @Delete(':id')
  async deleteTransfer(@Param('id') id: string): Promise<TransferEntity> {
    const transfer = await this.transferService.selectTransfer(id);
    this.transferService.deleteTransfer(id);
    return transfer;
  }

  @Post('income')
  @UseGuards(GuardsGuard)
  async getHistoryIn(
    @Body()
    body: {
      accountId: string;
      pagination: PaginationDTO;
      dataRange?: DataRangeDTO;
    },
  ): Promise<TransferEntity[]> {
    return this.transferService.getHistoryIn(
      body.accountId,
      body.pagination,
      body.dataRange,
    );
  }

  @Post('outcome')
  @UseGuards(GuardsGuard)
  async getHistoryOut(
    @Body()
    body: {
      accountId: string;
      pagination: PaginationDTO;
      dataRange?: DataRangeDTO;
    },
  ): Promise<TransferEntity[]> {
    return this.transferService.getHistoryOut(
      body.accountId,
      body.pagination,
      body.dataRange,
    );
  }

  @Post('history')
  @UseGuards(GuardsGuard)
  getHistory(
    @Body()
    body: {
      accountId: string;
      pagination: PaginationDTO;
      dataRange?: DataRangeDTO;
    },
  ): Promise<TransferEntity[]> {
    return this.transferService.getHistory(
      body.accountId,
      body.pagination,
      body.dataRange,
    );
  }
}
