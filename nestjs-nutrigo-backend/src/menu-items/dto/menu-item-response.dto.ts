import { ApiProperty } from '@nestjs/swagger';

class FoodPartnerSummaryDto {
  @ApiProperty()
  foodPartnerId: number;

  @ApiProperty()
  name: string;
}

export class MenuItemResponseDto {
  @ApiProperty()
  menuItemId: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  caloriesKcal?: number;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty()
  isOutOfStock: boolean;

  @ApiProperty({ type: FoodPartnerSummaryDto })
  foodPartner: FoodPartnerSummaryDto;
}

export class PaginatedMenuItemsDto {
  @ApiProperty({ type: [MenuItemResponseDto] })
  data: MenuItemResponseDto[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
