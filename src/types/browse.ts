export interface ProductComment {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ProductPooling {
  target: number;
  current: number;
  minFee: number;
  baseFee: number;
}

export interface ProductUser {
  name: string;
  verified: boolean;
  rating: number;
  image: string;
}

export interface ProductSwapper {
  id: string;
  name: string;
  avatar: string;
  offer: string;
  status: string;
}

export interface ProductHostView {
  type: string;
  announcement: string;
  swappers: ProductSwapper[];
  totalSlots: number;
  filledSlots: number;
}

export interface BrowseProduct {
  id: number;
  conversationId: string;
  tag: string;
  title: string;
  description: string;
  swapHeadline: string;
  whatOffering: string;
  whatWant: string;
  openToBundles: boolean;
  acceptsGroup: boolean;
  price: number;
  originalPrice: number | null;
  image: string;
  location: string;
  distance: number;
  type: string;
  swapType: string;
  deadline: string;
  pooling: ProductPooling | null;
  user: ProductUser;
  hostView?: ProductHostView;
  comments?: ProductComment[];
}
