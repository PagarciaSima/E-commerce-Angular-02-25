import { OrderProductQuantity } from "./order-product-quantity";

export interface OrderDetailsModel {
    fullName: string,
    fullAddress: string,
    contactNumber: string,
    alternateContactNumber: string,
    orderProductQuantityList: OrderProductQuantity[]
}
