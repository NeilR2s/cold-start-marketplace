import { Conversation, ChatMessage, SendMessageRequest, SendMessageResponse } from '@/types/chat';

const STORAGE_KEY = 'bitbit_chat_conversations';

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    channel: "pasabuy",
    partner: { name: "Miguel Travels", verified: true, status: "online" },
    lastMessage: "I'm at Don Quijote now, sending pics of the matcha kit kats!",
    timestamp: "2m ago",
    unread: 2,
    type: "buying",
    context: { label: "Japan Pasabuy", status: "In Progress" },
    messages: [
      {
        id: "msg_1",
        sender: "me",
        text: "Hi Miguel! Are you still accepting orders for the Tokyo trip?",
        time: "10:30 AM",
      },
      {
        id: "msg_2",
        sender: "them",
        text: "Yes! I have about 5kg capacity left. What do you need?",
        time: "10:35 AM",
      },
      {
        id: "msg_3",
        sender: "me",
        text: "Looking for the Strawberry Matcha KitKats, about 5 packs.",
        time: "10:36 AM",
      },
      {
        id: "msg_4",
        sender: "them",
        text: "Got it. I'm heading there now.",
        time: "10:40 AM",
      },
      {
        id: "msg_5",
        sender: "them",
        text: "I'm at Don Quijote now, sending pics of the matcha kit kats!",
        time: "Now",
      },
    ],
  },
  {
    id: "c2",
    channel: "pasabuy",
    partner: { name: "Sarah FA", verified: true, status: "offline" },
    lastMessage: "Payment received via Escrow. I will ship this on Monday.",
    timestamp: "1d ago",
    unread: 0,
    type: "buying",
    context: { label: "Olive Young Order", status: "Paid" },
    messages: [
      {
        id: "msg_6",
        sender: "me",
        text: "Payment sent for the serum!",
        time: "Yesterday",
      },
      {
        id: "msg_7",
        sender: "them",
        text: "Payment received via Escrow. I will ship this on Monday.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "trav-chat-miguel",
    channel: "traveler",
    partner: { name: "Miguel R.", verified: true, status: "online" },
    lastMessage: "I can grab the Switch OLED today—still want the neon one?",
    timestamp: "Just now",
    unread: 0,
    type: "traveler",
    context: { label: "Traveler Swap", status: "Active", route: "NRT ➝ MNL" },
    messages: [
      {
        id: "msg_8",
        sender: "me",
        text: "Hi Miguel! Can you bitbit a Switch OLED for a keyboard kit swap?",
        time: "10:03 AM",
      },
      {
        id: "msg_9",
        sender: "them",
        text: "I can grab one later. Need it in neon or white?",
        time: "10:05 AM",
      },
      {
        id: "msg_10",
        sender: "me",
        text: "Neon please! I can add Sagada beans to the kapalit bundle.",
        time: "10:07 AM",
      },
    ],
  },
  {
    id: "trav-chat-angela",
    channel: "traveler",
    partner: { name: "Angela K.", verified: true, status: "online" },
    lastMessage: "Laneige sets back in stock—locking your slot.",
    timestamp: "8m ago",
    unread: 1,
    type: "traveler",
    context: { label: "Traveler Swap", status: "Confirming", route: "ICN ➝ CEB" },
    messages: [
      {
        id: "msg_11",
        sender: "me",
        text: "Hi Angela! Still open for Laneige + Gentle Monster request?",
        time: "9:15 AM",
      },
      {
        id: "msg_12",
        sender: "them",
        text: "Yes! Laneige restocked. Gentle Monster might need preorder though.",
        time: "9:18 AM",
      },
    ],
  },
  {
    id: "trav-chat-omar",
    channel: "traveler",
    partner: { name: "Omar D.", verified: true, status: "offline" },
    lastMessage: "Send your kapalit list so I can finalize before flying.",
    timestamp: "1h ago",
    unread: 0,
    type: "traveler",
    context: { label: "Traveler Swap", status: "Packing", route: "DXB ➝ MNL ➝ DVO" },
    messages: [
      {
        id: "msg_13",
        sender: "me",
        text: "Need IKEA organizers + Bateel dates. Kapalit would be smart home plugs.",
        time: "8:05 AM",
      },
      {
        id: "msg_14",
        sender: "them",
        text: "Copy! Send kapalit list before I check in luggage.",
        time: "8:40 AM",
      },
    ],
  },
  {
    id: "trav-chat-sari",
    channel: "traveler",
    partner: { name: "Sari Express Crew", verified: true, status: "online" },
    lastMessage: "Bulk pickup window is 3-4PM daily at T3 curbside.",
    timestamp: "20m ago",
    unread: 3,
    type: "traveler",
    context: { label: "Traveler Swap", status: "Dispatching", route: "NAIA loop" },
    messages: [
      {
        id: "msg_15",
        sender: "me",
        text: "Can you grab 5 balikbayan boxes + snacks this afternoon?",
        time: "7:55 AM",
      },
      {
        id: "msg_16",
        sender: "them",
        text: "Yes, drop kapalit offers in thread by lunch.",
        time: "8:10 AM",
      },
    ],
  },
  {
    id: "trav-chat-lena",
    channel: "traveler",
    partner: { name: "Lena V.", verified: false, status: "online" },
    lastMessage: "Keychron restocked! Want me to reserve one?",
    timestamp: "45m ago",
    unread: 0,
    type: "traveler",
    context: { label: "Traveler Swap", status: "Sourcing", route: "SFO ➝ LAX ➝ MNL" },
    messages: [
      {
        id: "msg_17",
        sender: "me",
        text: "Need Keychron switches + record sleeves. Can swap handmade totes.",
        time: "7:30 AM",
      },
      {
        id: "msg_18",
        sender: "them",
        text: "Keychron restocked! Want me to reserve one?",
        time: "7:45 AM",
      },
    ],
  },
  {
    id: "swap-chat-sarah",
    channel: "host",
    partner: { name: "Sarah J.", verified: true, status: "online" },
    lastMessage: "Post your pastry bundle offer so I can lock the slot.",
    timestamp: "5m ago",
    unread: 1,
    type: "buying",
    context: { label: "Swap Thread", status: "Bidding", productTag: "sakura-tumbler", productName: "Limited Starbucks Sakura Tumbler 2024" },
    messages: [
      {
        id: "msg_19",
        sender: "them",
        text: "Hi! Saw your bid for brownies + service hour. Please comment on the listing so others can see.",
        time: "4:40 PM",
      },
      {
        id: "msg_20",
        sender: "me",
        text: "Done! Added details + meetup availability.",
        time: "4:42 PM",
      },
      {
        id: "msg_21",
        sender: "them",
        text: "Great. I tagged you on the comments—once we hit 15 slots I'll confirm here.",
        time: "Now",
      },
    ],
  },
  {
    id: "swap-chat-mike",
    channel: "host",
    partner: { name: "Mike T.", verified: true, status: "offline" },
    lastMessage: "Meetup still at Greenbelt, Saturday 4PM?",
    timestamp: "2h ago",
    unread: 0,
    type: "buying",
    context: { label: "Swap Thread", status: "Negotiating", productTag: "gentle-monster", productName: "Gentle Monster Sunglasses (Rick 01)" },
    messages: [
      {
        id: "msg_22",
        sender: "me",
        text: "Can throw in 2hrs styling services for the Rick 01 frame.",
        time: "2h ago",
      },
      {
        id: "msg_23",
        sender: "them",
        text: "Noted. Meetup still Greenbelt Saturday 4PM?",
        time: "2h ago",
      },
    ],
  },
];

class ChatService {
  private getStoredConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return INITIAL_CONVERSATIONS;
  }

  private saveConversations(conversations: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // ignore
    }
  }

  public async getConversations(): Promise<Conversation[]> {
    return this.getStoredConversations();
  }

  public async getConversationById(id: string): Promise<Conversation | null> {
    const list = this.getStoredConversations();
    return list.find((c) => c.id === id) || null;
  }

  public async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const conversations = this.getStoredConversations();
    const target = conversations.find((c) => c.id === request.conversationId);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      text: request.text.trim(),
      time: timeStr,
      delivered: true,
      timestamp: Date.now(),
    };

    if (target) {
      target.messages.push(newMessage);
      target.lastMessage = newMessage.text;
      target.timestamp = "Just now";
      this.saveConversations(conversations);
    }

    return {
      conversationId: request.conversationId,
      message: newMessage,
    };
  }
}

export const chatService = new ChatService();
