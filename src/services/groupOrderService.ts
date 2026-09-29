import { GroupOrder, JoinGroupOrderRequest, JoinGroupOrderResponse } from '@/types/groupOrder';
import { MOCK_GOS } from '@/data';

const GOS_STORAGE_KEY = 'bitbit_group_orders';

class GroupOrderService {
  private getStoredGroupOrders(): GroupOrder[] {
    try {
      const stored = localStorage.getItem(GOS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return MOCK_GOS;
  }

  private saveGroupOrders(orders: GroupOrder[]): void {
    try {
      localStorage.setItem(GOS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }

  public async getGroupOrders(): Promise<GroupOrder[]> {
    return this.getStoredGroupOrders();
  }

  public async getGroupOrderById(id: string): Promise<GroupOrder | null> {
    const list = this.getStoredGroupOrders();
    return list.find((g) => g.id === id) || null;
  }

  /**
   * Ambag Algorithm: Calculates service fee based on participant volume
   */
  public calculateFee(groupOrder: GroupOrder, count: number): number {
    const { baseFee, minFee, target } = groupOrder.pooling;
    if (count >= target) return minFee;
    const discount = ((baseFee - minFee) / target) * count;
    return Math.round(baseFee - discount);
  }

  public async joinGroupOrder(request: JoinGroupOrderRequest): Promise<JoinGroupOrderResponse> {
    const orders = this.getStoredGroupOrders();
    const target = orders.find((o) => o.id === request.groupOrderId);
    if (!target) {
      throw new Error(`Group order ${request.groupOrderId} not found`);
    }

    target.pooling.current += request.quantity || 1;
    this.saveGroupOrders(orders);

    const updatedFee = this.calculateFee(target, target.pooling.current);

    return {
      success: true,
      groupOrderId: request.groupOrderId,
      newParticipantCount: target.pooling.current,
      updatedFee,
      joinedAt: new Date().toISOString(),
    };
  }
}

export const groupOrderService = new GroupOrderService();
