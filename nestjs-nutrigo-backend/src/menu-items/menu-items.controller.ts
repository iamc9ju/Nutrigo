import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { FindMenuItemsQueryDto } from './dto/find-menu-items-query.dto';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  async findAll(@Query() query: FindMenuItemsQueryDto) {
    return this.menuItemsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }
}
