export interface GroupOrderItem {
  name: string;
  price: number;
}

export interface GroupOrderPooling {
  current: number;
  target: number;
  baseFee: number;
  minFee: number;
}

export interface GroupOrderManager {
  name: string;
  verified: boolean;
  avatar?: string;
}

export interface GroupOrder {
  id: string;
  title: string;
  manager: GroupOrderManager;
  region: string;
  status: 'open' | 'packing' | 'closed' | string;
  deadline: string;
  category: string;
  items: GroupOrderItem[];
  pooling: GroupOrderPooling;
  biases: string[];
}

export interface JoinGroupOrderRequest {
  groupOrderId: string;
  selectedBias?: string;
  quantity?: number;
  paymentMethod?: 'escrow' | 'wallet';
}

export interface JoinGroupOrderResponse {
  success: boolean;
  groupOrderId: string;
  newParticipantCount: number;
  updatedFee: number;
  joinedAt: string;
}
