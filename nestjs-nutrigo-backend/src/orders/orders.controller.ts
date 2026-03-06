import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, OrderStatus } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.patient)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async create(@Body() createDto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(createDto, user.sub);
  }

  @Get()
  @Roles(UserRole.patient, UserRole.food_partner, UserRole.admin)
  @ApiOperation({ summary: 'Get all orders for the current user/partner' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user.sub, user.role);
  }

  @Get(':id')
  @Roles(UserRole.patient, UserRole.food_partner, UserRole.admin)
  @ApiOperation({ summary: 'Get details of a specific order' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.findOne(id, user.sub, user.role);
  }

  @Patch(':id/status')
  @Roles(UserRole.food_partner, UserRole.admin)
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.updateStatus(id, status, user.sub, user.role);
  }
}
