import { Image } from "./image";

export interface Product {
  productId?: number;
  productName: string;
  productDescription: string;
  productDiscountedPrice: number;
  productActualPrice: number;
  productImages?: Image[]; // Agregamos la propiedad para las imágenes
}


