import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const baseClient = new PrismaClient();
const extendedClient = baseClient.$extends(withAccelerate());

type ExtendedPrismaClient = typeof extendedClient;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly _client: ExtendedPrismaClient;

  constructor() {
    this._client = extendedClient;
  }

  async onModuleInit() {
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
  }

  get client(): ExtendedPrismaClient {
    return this._client;
  }
}
