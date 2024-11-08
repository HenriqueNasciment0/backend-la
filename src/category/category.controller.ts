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
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category-dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createCategory(@Body() data: CreateCategoryDto) {
    return this.categoryService.createCategory(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateCategory(
    @Param('id') id: string,
    @Body() data: Prisma.CategoryUpdateInput,
  ) {
    return this.categoryService.updateCategory({
      where: { id: Number(id) },
      data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory({ id: Number(id) });
  }
}
