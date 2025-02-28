import { Product } from "./product";
import { User } from "./user";

export interface Cart {
    id?: number,
    product: Product,
    user: User
}
