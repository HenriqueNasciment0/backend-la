import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LocationService } from './location.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLocationDto } from './dto/create-location-dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getLocations() {
    return this.locationService.getLocations();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getLocationById(@Param('id') id: string) {
    return this.locationService.getLocationById({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createLocation(@Body() data: CreateLocationDto) {
    return this.locationService.createLocation(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateLocation(
    @Param('id') id: string,
    @Body() data: Prisma.LocationUpdateInput,
  ) {
    return this.locationService.updateLocation({
      where: { id: Number(id) },
      data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteLocation(@Param('id') id: string) {
    return this.locationService.deleteLocation({ id: Number(id) });
  }
}
