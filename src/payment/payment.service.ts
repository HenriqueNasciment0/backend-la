import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async getPayment(): Promise<Payment[]> {
    return this.prisma.client.payment.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getPaymentById(
    where: Prisma.PaymentWhereUniqueInput,
  ): Promise<Payment> {
    return this.prisma.client.payment.findUnique({ where });
  }

  async createPayment(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.client.payment.create({ data });
  }

  async updatePayment(params: {
    where: Prisma.PaymentWhereUniqueInput;
    data: Prisma.PaymentUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.client.payment.update({
      data: {
        ...data,
        updatedAt: new Date(),
      },
      where,
    });
  }

  async deletePayment(where: Prisma.PaymentWhereUniqueInput): Promise<Payment> {
    return this.prisma.client.payment.delete({ where });
  }
}
