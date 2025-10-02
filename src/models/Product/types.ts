// Types spécifiques au modèle Product
export interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: {
    id: number;
    email: string;
  };
}

// Types pour les arguments des résolveurs
export interface CreateProductArgs {
  input: {
    name: string;
    price: number;
  };
}

// Types pour les réponses des résolveurs
export type ProductsResolver = (
  parent: unknown,
  args: unknown,
  context: any
) => Promise<Product[]>;

export type CreateProductResolver = (
  parent: unknown,
  args: CreateProductArgs,
  context: any
) => Promise<Product>;

export type UpdateProductResolver = (
  parent: unknown,
  args: { id: string; input: Partial<CreateProductArgs['input']> },
  context: any
) => Promise<Product>;

export type DeleteProductResolver = (
  parent: unknown,
  args: { id: string },
  context: any
) => Promise<boolean>;

export interface BulkCreateProductsArgs {
  inputs: { name: string; price: number }[];
  ownerId?: string;
}