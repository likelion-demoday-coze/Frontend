export interface Storeitems {
  itemId: number;
  itemCode: string;
  name: string;
  fishPrice: number;
  description: string;
}

export interface PurchaseItem {
  purchaseId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  balanceAfter: number;
  quantityAfter: number;
  createdAt: string | null;
}

export interface MyItem {
  itemId: number;
  itemCode: string;
  name: string;
  quantity: number;
}
