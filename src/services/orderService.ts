import { OrderTransaction, OrderStep, UpdateOrderStatusRequest, SubmitRatingRequest, SavedRating } from '@/types/orders';
import { CURRENT_USER, UserProfile } from '@/data';

const ORDERS_STORAGE_KEY = 'bitbit_orders_transactions';
const RATINGS_STORAGE_KEY = 'bitbit_orders_ratings';

const getInitialOrders = (user?: UserProfile | null): OrderTransaction[] => {
  const currentUserId = user?.uid || CURRENT_USER.uid;
  const currentUserName = user?.displayName || CURRENT_USER.displayName;
  const currentUserAvatar = user?.avatar || CURRENT_USER.avatar;

  return [
    {
      id: "tx_1",
      conversationId: "c1",
      status: "ongoing",
      step: "Coordinating Swap",
      product: {
        id: 1,
        title: "Limited Starbucks Sakura Tumbler 2024",
        price: 1250,
        image: "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&q=80&w=600",
        location: "Tokyo, JP",
      },
      host: {
        id: currentUserId,
        name: currentUserName,
        avatar: currentUserAvatar,
      },
      swapper: {
        id: "u201",
        name: "Sarah J.",
        avatar: "https://i.pravatar.cc/150?u=1",
      },
      deadline: "2024-03-25"
    },
    {
      id: "tx_2",
      conversationId: "c2",
      status: "ongoing",
      step: "In Transit to Meet-up",
      product: {
        id: 3,
        title: "Don Quijote Matcha KitKats (12 Pack)",
        price: 450,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ318pT1StZ1ZlM4fkIoI6SfcTCGdi_9TG7-Q&s",
        location: "Osaka, JP",
      },
      host: {
        id: "u202",
        name: "Mike R.",
        avatar: "https://i.pravatar.cc/150?u=2",
      },
      swapper: {
        id: currentUserId,
        name: currentUserName,
        avatar: currentUserAvatar,
      },
      deadline: "2024-03-22"
    },
    {
      id: "tx_3",
      conversationId: "c1",
      status: "past",
      step: "Swap Completed",
      product: {
        id: 5,
        title: "Gentle Monster Sunglasses",
        price: 15200,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
        location: "Seoul, KR",
      },
      host: {
        id: "u203",
        name: "Jessica L.",
        avatar: "https://i.pravatar.cc/150?u=3",
      },
      swapper: {
        id: currentUserId,
        name: currentUserName,
        avatar: currentUserAvatar,
      },
      deadline: "2024-02-10"
    },
    {
      id: "tx_4",
      conversationId: "c2",
      status: "past",
      step: "Swap Cancelled",
      product: {
        id: 8,
        title: "Olive Young Skin Care Set",
        price: 3200,
        image: "https://sugarpeachesloves.net/wp-content/uploads/2022/08/Olive-Young-Global-5-step-skincare-routine-scaled.jpeg",
        location: "Seoul, KR",
      },
      host: {
        id: currentUserId,
        name: currentUserName,
        avatar: currentUserAvatar,
      },
      swapper: {
        id: "u204",
        name: "David K.",
        avatar: "https://i.pravatar.cc/150?u=4",
      },
      deadline: "2024-01-15"
    }
  ];
};

class OrderService {
  public async getOrders(user?: UserProfile | null): Promise<OrderTransaction[]> {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    const initial = getInitialOrders(user);
    this.saveOrders(initial);
    return initial;
  }

  private saveOrders(orders: OrderTransaction[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }

  public async getRatings(): Promise<Record<string, SavedRating>> {
    try {
      const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {};
  }

  public async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<OrderTransaction> {
    const orders = await this.getOrders();
    const target = orders.find((o) => o.id === request.orderId);
    if (!target) {
      throw new Error(`Order ${request.orderId} not found`);
    }

    target.step = request.nextStep;
    if (request.status) {
      target.status = request.status;
    } else if (request.nextStep === 'Swap Completed' || request.nextStep === 'Swap Cancelled') {
      target.status = 'past';
    }
    target.updatedAt = new Date().toISOString();

    this.saveOrders(orders);
    return target;
  }

  public async submitRating(request: SubmitRatingRequest): Promise<SavedRating> {
    const ratings = await this.getRatings();
    const newRating: SavedRating = {
      value: request.value,
      comment: request.comment,
      createdAt: new Date().toISOString(),
      targetUserId: request.targetUserId,
    };

    ratings[request.orderId] = newRating;
    try {
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    } catch {
      // ignore
    }

    return newRating;
  }

  public getNextStep(currentStep: OrderStep): OrderStep {
    switch (currentStep) {
      case 'Pending Confirmation':
        return 'Coordinating Swap';
      case 'Coordinating Swap':
        return 'In Transit to Meet-up';
      case 'In Transit to Meet-up':
        return 'Swap Completed';
      default:
        return currentStep;
    }
  }
}

export const orderService = new OrderService();
