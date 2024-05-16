import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccountDTO } from 'src/business/dtos';
import { GuardsGuard } from 'src/presentation/guards/guards.guard';
import { AccountService } from '../../../business/services';
import { CustomerService } from '../../../business/services/customer/customer.service';
import { AccountEntity } from '../../../data/persistence/entities';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
  ) {}

  @Get('balance/:id')
  async getBalance(@Param('id') id: string): Promise<number> {
    return await this.accountService.getBalance(id);
  }

  @Get('amount/:id')
  @UseGuards(GuardsGuard)
  async getBalanceAll(@Param('id') id: string): Promise<boolean> {
    return await this.accountService.CustomerBalance(id);
  }

  @Get()
  @UseGuards(GuardsGuard)
  async getAll(): Promise<AccountEntity[]> {
    return await this.accountService.findAll();
  }

  @Post()
  @UseGuards(GuardsGuard)
  async createAccount(@Body() account: AccountDTO): Promise<AccountEntity> {
    return await this.accountService.createAccount(account);
  }

  @Post(':id')
  @UseGuards(GuardsGuard)
  async addBalance(
    @Param('id') id: string,
    @Body() body: { amount: number },
  ): Promise<string> {
    if (body.amount < 0) return 'debe ser un numero positivo';
    this.accountService.addBalance(id, body.amount);
    return '' + this.accountService.getBalance(id);
  }

  @Put('removebalance/:id')
  @UseGuards(GuardsGuard)
  removeBalance(
    @Param('id') id: string,
    @Body() body: { amount: number },
  ): boolean {
    if (
      body.amount < 0 ||
      !this.accountService.verifyAmountIntoBalance(id, body.amount)
    )
      return false;
    this.accountService.removeBalance(id, body.amount);
    this.accountService.getBalance(id);
    return true;
  }

  @Get('/customer/:id')
  async getAccountByCustomerId(
    @Param('id') id: string,
  ): Promise<AccountEntity[]> {
    return await this.accountService.getAccountByCustomerId(id);
  }

  @Get('/account/:id')
  async amountBalance(
    @Param('id') id: string,
    @Body() body: { amount: number },
  ): Promise<boolean> {
    return await this.accountService.verifyAmountIntoBalance(id, body.amount);
  }

  @Put(':id')
  changeState(
    @Param('id') id: string,
    @Body() body: { state: boolean },
  ): string {
    this.accountService.changeState(id, body.state);
    return 'estado cambiado';
  }

  @Get('state/:id')
  async getState(@Param('id') id: string): Promise<boolean> {
    return await this.accountService.getState(id);
  }

  @Put('accountype/:id')
  changeAccountType(
    @Param('id') id: string,
    @Body() body: { accountTypeId: string },
  ): string {
    this.accountService.changeAccountType(id, body.accountTypeId);
    return 'cuenta cambiada';
  }

  @Delete(':id')
  deleteAccount(@Param('id') id: string): string {
    this.accountService.deleteAccount(id);
    return 'cuenta eliminada';
  }
}
