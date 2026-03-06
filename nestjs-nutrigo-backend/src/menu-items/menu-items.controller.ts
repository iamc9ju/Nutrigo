import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { MenuItemsService } from './menu-items.service';
import { FindMenuItemsQueryDto } from './dto/find-menu-items-query.dto';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/menu-item-request.dto';
import {
  MenuItemResponseDto,
  PaginatedMenuItemsDto,
} from './dto/menu-item-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('MenuItems')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  @ApiOperation({ summary: 'List all menu items with advanced filtering' })
  @ApiResponse({ status: 200, type: PaginatedMenuItemsDto })
  async findAll(@Query() query: FindMenuItemsQueryDto) {
    return this.menuItemsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get detailed information for a specific menu item',
  })
  @ApiResponse({ status: 200, type: MenuItemResponseDto })
  @ApiNotFoundResponse({ description: 'Menu item not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.food_partner, UserRole.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, type: MenuItemResponseDto })
  @ApiForbiddenResponse({ description: 'Only Food Partners can create items' })
  async create(@Body() createDto: CreateMenuItemDto, @CurrentUser() user: any) {
    return this.menuItemsService.create(createDto, user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.food_partner, UserRole.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing menu item' })
  @ApiResponse({ status: 200, type: MenuItemResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMenuItemDto,
    @CurrentUser() user: any,
  ) {
    return this.menuItemsService.update(id, updateDto, user.sub, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.food_partner, UserRole.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiResponse({ status: 204, description: 'Successfully deleted' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    await this.menuItemsService.remove(id, user.sub, user.role);
    return { message: 'Item deleted successfully' };
  }
}
