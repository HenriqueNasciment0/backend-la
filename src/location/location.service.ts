import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Location, Prisma } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async getLocations(): Promise<Location[]> {
    return this.prisma.location.findMany();
  }

  async getLocationById(
    where: Prisma.LocationWhereUniqueInput,
  ): Promise<Location | null> {
    return this.prisma.location.findUnique({ where });
  }

  async createLocation(data: Prisma.LocationCreateInput): Promise<Location> {
    return this.prisma.location.create({ data });
  }

  async updateLocation(params: {
    where: Prisma.LocationWhereUniqueInput;
    data: Prisma.LocationUpdateInput;
  }): Promise<Location> {
    const { where, data } = params;
    return this.prisma.location.update({ data, where });
  }

  async deleteLocation(
    where: Prisma.LocationWhereUniqueInput,
  ): Promise<Location> {
    return this.prisma.location.delete({ where });
  }
}
