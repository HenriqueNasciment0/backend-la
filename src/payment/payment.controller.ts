import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment-dto';
import { Prisma } from '@prisma/client';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPayment() {
    return this.paymentService.getPayment();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPaymentById(id: string) {
    return this.paymentService.getPaymentById({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPayment(@Body() data: CreatePaymentDto) {
    return this.paymentService.createPayment(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePayment(
    @Body() data: Prisma.PaymentUpdateInput,
    @Param('id') id: string,
  ) {
    return this.paymentService.updatePayment({
      where: { id: Number(id) },
      data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    return this.paymentService.deletePayment({ id: Number(id) });
  }
}
