import api from "@/lib/api";

export interface MenuItem {
  menuItemId: number;
  foodPartnerId: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  caloriesKcal?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  stockQuantity: number;
  isOutOfStock: boolean;
  isAvailable: boolean;
  foodPartner: {
    foodPartnerId: number;
    partnerName: string;
    description?: string;
    address?: string;
  };
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  caloriesKcal?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  stockQuantity?: number;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {
  isAvailable?: boolean;
  isOutOfStock?: boolean;
}

export interface MenuItemParams {
  foodPartnerId?: number;
  category?: string;
  maxCalories?: number;
  q?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const menuApi = {
  getMenuItems: async (params?: MenuItemParams) => {
    const res = await api.get("/menu-items", { params });
    return res.data;
  },

  getMenuItemById: async (id: number) => {
    const res = await api.get(`/menu-items/${id}`);
    return res.data;
  },

  createMenuItem: async (data: CreateMenuItemDto) => {
    const res = await api.post("/menu-items", data);
    return res.data;
  },

  updateMenuItem: async (id: number, data: UpdateMenuItemDto) => {
    const res = await api.patch(`/menu-items/${id}`, data);
    return res.data;
  },

  deleteMenuItem: async (id: number) => {
    const res = await api.delete(`/menu-items/${id}`);
    return res.data;
  },
};
