export type Cocktail = {
  id: string;
  name: string;
  description?: string | null;
  salePrice: number;
  category?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCocktailPayload = {
  name: string;
  description?: string;
  salePrice: number;
  category?: string;
  isActive?: boolean;
};

export type CocktailsResponse = {
  success: boolean;
  data: Cocktail[];
};

export type CocktailResponse = {
  success: boolean;
  message: string;
  data: Cocktail;
};

export type Cocktail = {
  id: string;
  name: string;
  description?: string | null;
  salePrice: number;
  category?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCocktailPayload = {
  name: string;
  description?: string;
  salePrice: number;
  category?: string;
  imageUrl?: string;
  isActive?: boolean;
};
