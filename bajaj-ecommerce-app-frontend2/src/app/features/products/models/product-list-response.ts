import { ProductData } from "./product-data";

export class ProductListResponse {
    success: boolean;
    total: number;
    page: number;
    pages: number;
    count: number;
    data: ProductData[];
}
