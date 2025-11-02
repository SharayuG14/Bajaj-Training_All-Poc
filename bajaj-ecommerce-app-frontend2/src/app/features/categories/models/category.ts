export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string;
}
