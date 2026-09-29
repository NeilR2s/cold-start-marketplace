export type OrderStatus = 'ongoing' | 'past';

export type OrderStep = 
  | 'Pending Confirmation'
  | 'Coordinating Swap'
  | 'In Transit to Meet-up'
  | 'Swap Completed'
  | 'Swap Cancelled';

export interface OrderCounterparty {
  id: string;
  name: string;
  avatar: string;
}

export interface OrderProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  location: string;
}

export interface OrderTransaction {
  id: string;
  conversationId: string;
  status: OrderStatus;
  step: OrderStep;
  product: OrderProduct;
  host: OrderCounterparty;
  swapper: OrderCounterparty;
  deadline: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedRating {
  value: number;
  comment: string;
  createdAt: string;
  targetUserId?: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  nextStep: OrderStep;
  status?: OrderStatus;
}

export interface SubmitRatingRequest {
  orderId: string;
  targetUserId: string;
  value: number;
  comment: string;
}
