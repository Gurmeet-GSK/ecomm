import type { User } from "./userTypes";
import type { Order } from "./orderTypes";
import type { Seller } from "./SellerTypes";

export interface Transaction {
    id: number;
    customer: User;
    order: Order;
    seller: Seller;
    date: string;
}
