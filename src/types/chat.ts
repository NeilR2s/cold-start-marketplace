export type MessageSenderRole = 'me' | 'them';

export interface ChatMessage {
  id: string | number;
  sender: MessageSenderRole;
  text: string;
  time: string;
  timestamp?: number;
  delivered?: boolean;
  read?: boolean;
}

export interface ChatPartner {
  id?: string;
  name: string;
  avatar?: string;
  verified: boolean;
  status: 'online' | 'offline';
}

export interface ChatContext {
  label: string;
  status: string;
  route?: string;
  productTag?: string;
  productName?: string;
}

export type ChatChannel = 'pasabuy' | 'traveler' | 'host';

export interface Conversation {
  id: string;
  channel: ChatChannel;
  partner: ChatPartner;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: string;
  context: ChatContext;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  conversationId: string;
  text: string;
  senderId?: string;
}

export interface SendMessageResponse {
  conversationId: string;
  message: ChatMessage;
}
