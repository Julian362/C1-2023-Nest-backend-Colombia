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
import { CustomerUpdateDTO } from 'src/business/dtos/update-customer.dto';
import { GuardsGuard } from 'src/presentation/guards/guards.guard';
import { CustomerDTO } from '../../../business/dtos';
import { CustomerService } from '../../../business/services/customer/customer.service';
import { AccountEntity } from '../../../data/persistence/entities/account.entity';
import { CustomerEntity } from '../../../data/persistence/entities/customer.entity';

@Controller('user')
export class UserController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAllUsers(): Promise<CustomerEntity[]> {
    return this.customerService.findAll();
  }
  @Get('deleted')
  async findAllUsersDeleted(): Promise<CustomerEntity[]> {
    return this.customerService.findAllDeleted();
  }

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<CustomerEntity> {
    return this.customerService.getCustomerInfo(id);
  }
  @Get('email/:email')
  async findUserByEmail(
    @Param('email') email: string,
  ): Promise<CustomerEntity> {
    return this.customerService.getCustomerInfoByEmail(email);
  }

  @Post()
  async registerUser(@Body() customer: CustomerDTO): Promise<{
    customer: CustomerEntity;
    account: AccountEntity;
  }> {
    return this.customerService.newCustomer(customer);
  }

  @Put(':id')
  @UseGuards(GuardsGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() customer: CustomerUpdateDTO,
  ): Promise<CustomerEntity> {
    return this.customerService.updatedCustomer(id, customer);
  }

  @Delete(':id')
  // @UseGuards(GuardsGuard)
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    return this.customerService.deleteCustomer(id);
  }

  @Put('unsuscribe/:id')
  async unsuscribeUser(@Param('id') id: string): Promise<boolean> {
    return this.customerService.unsuscribe(id);
  }
}
