import { Product } from "./product";
import { User } from "./user";

export interface MyOrderDetails {
    orderId: number;
    orderFullName: string,
    orderFullOrder: string,
    orderContactNumber: string,
    orderAlternateContactNumber: string,
    orderStatus: string,
    orderAmount: number,
    product: Product,
    user: User
}
