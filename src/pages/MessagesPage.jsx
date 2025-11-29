import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  ArrowLeft,
  ShieldCheck,
  CheckCheck,
  Image as ImageIcon,
} from "lucide-react";
import { Card, Avatar } from "@/components/CustomComponents";

const CHANNEL_LABELS = {
  pasabuy: "Pasabuy",
  traveler: "Traveler Swap",
  host: "Swap Host",
};

const CHANNEL_STYLES = {
  pasabuy: "bg-purple-50 border-purple-100 text-purple-700",
  traveler: "bg-emerald-50 border-emerald-100 text-emerald-700",
  host: "bg-blue-50 border-blue-100 text-blue-700",
};

// Mock Data for Conversations
const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    channel: "pasabuy",
    partner: { name: "Miguel Travels", verified: true, status: "online" },
    lastMessage: "I'm at Don Quijote now, sending pics of the matcha kit kats!",
    timestamp: "2m ago",
    unread: 2,
    type: "buying", // User is the customer
    context: { label: "Japan Pasabuy", status: "In Progress" },
    messages: [
      {
        id: 1,
        sender: "me",
        text: "Hi Miguel! Are you still accepting orders for the Tokyo trip?",
        time: "10:30 AM",
      },
      {
        id: 2,
        sender: "them",
        text: "Yes! I have about 5kg capacity left. What do you need?",
        time: "10:35 AM",
      },
      {
        id: 3,
        sender: "me",
        text: "Looking for the Strawberry Matcha KitKats, about 5 packs.",
        time: "10:36 AM",
      },
      {
        id: 4,
        sender: "them",
        text: "Got it. I'm heading there now.",
        time: "10:40 AM",
      },
      {
        id: 5,
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
        id: 1,
        sender: "me",
        text: "Payment sent for the serum!",
        time: "Yesterday",
      },
      {
        id: 2,
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
        id: 1,
        sender: "me",
        text: "Hi Miguel! Can you bitbit a Switch OLED for a keyboard kit swap?",
        time: "10:03 AM",
      },
      {
        id: 2,
        sender: "them",
        text: "I can grab one later. Need it in neon or white?",
        time: "10:05 AM",
      },
      {
        id: 3,
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
        id: 1,
        sender: "me",
        text: "Hi Angela! Still open for Laneige + Gentle Monster request?",
        time: "9:15 AM",
      },
      {
        id: 2,
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
        id: 1,
        sender: "me",
        text: "Need IKEA organizers + Bateel dates. Kapalit would be smart home plugs.",
        time: "8:05 AM",
      },
      {
        id: 2,
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
        id: 1,
        sender: "me",
        text: "Can you grab 5 balikbayan boxes + snacks this afternoon?",
        time: "7:55 AM",
      },
      {
        id: 2,
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
        id: 1,
        sender: "me",
        text: "Need Keychron switches + record sleeves. Can swap handmade totes.",
        time: "7:30 AM",
      },
      {
        id: 2,
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
        id: 1,
        sender: "them",
        text: "Hi! Saw your bid for brownies + service hour. Please comment on the listing so others can see.",
        time: "4:40 PM",
      },
      {
        id: 2,
        sender: "me",
        text: "Done! Added details + meetup availability.",
        time: "4:42 PM",
      },
      {
        id: 3,
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
        id: 1,
        sender: "me",
        text: "Can throw in 2hrs styling services for the Rick 01 frame.",
        time: "2h ago",
      },
      {
        id: 2,
        sender: "them",
        text: "Noted. Meetup still Greenbelt Saturday 4PM?",
        time: "2h ago",
      },
    ],
  },
];

const TAB_OPTIONS = [
  { id: "all", label: "All Chats" },
  { id: "traveler", label: "Traveler" },
  { id: "pasabuy", label: "Pasabuy" },
  { id: "host", label: "Swap Hosts" },
];

const MessagesPage = () => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();
  const [highlightedProductTag, setHighlightedProductTag] = useState(
    location.state?.productTag || null
  );

  useEffect(() => {
    const { conversationId, chatType, productTag, linkedTag } = location.state ?? {};

    if (productTag) {
      setHighlightedProductTag(productTag);
    }

    if (conversationId) {
      const linkedConversation = MOCK_CONVERSATIONS.find((chat) => chat.id === conversationId);
      if (linkedConversation) {
        setTimeout(() => {
          setActiveChatId(linkedConversation.id);
          setActiveTab(chatType ?? linkedConversation.channel ?? "all");
        }, 0);
      }
      return;
    }

    if (linkedTag) {
      const linkedByTag = MOCK_CONVERSATIONS.find((chat) => chat.context?.label === linkedTag);
      if (linkedByTag) {
        setTimeout(() => {
          setActiveChatId(linkedByTag.id);
          setActiveTab(chatType ?? linkedByTag.channel ?? "all");
          setHighlightedProductTag(linkedTag);
        }, 0);
      }
      return;
    }

    if (chatType && chatType !== "all") {
      setActiveTab(chatType);
    }
  }, [location]);

  const activeChat = MOCK_CONVERSATIONS.find((c) => c.id === activeChatId);

  // Filter conversations
  const filteredConversations = MOCK_CONVERSATIONS.filter((chat) => {
    if (activeTab === "all") return true;
    return chat.channel === activeTab;
  });

  // Render the Main List
  if (!activeChatId) {
    return (
      <div className="pb-24 space-y-6 animate-in fade-in px-4 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold">
            {MOCK_CONVERSATIONS.filter((c) => c.unread > 0).length} New
          </div>
        </div>

        {/* Search & Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search orders or people..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>

          <div className="flex p-1 bg-slate-200/50 rounded-xl">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="space-y-3">
          {filteredConversations.map((chat) => (
            <Card
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className="p-4 flex gap-4 items-start active:scale-[0.99] cursor-pointer"
            >
              <div className="relative">
                <Avatar
                  name={chat.partner.name}
                  verified={chat.partner.verified}
                  size="md"
                />
                {chat.partner.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm truncate">
                    {chat.partner.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                    {chat.timestamp}
                  </span>
                </div>

                {/* Context Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {chat.context.label}
                  </span>
                  {chat.channel && (
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${CHANNEL_STYLES[chat.channel]}`}>
                      {CHANNEL_LABELS[chat.channel]}
                    </span>
                  )}
                  {chat.context.productName && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700 truncate max-w-[120px]">
                      #{chat.context.productName}
                    </span>
                  )}
                  {highlightedProductTag === chat.context.productTag && (
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      From listing
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center gap-2">
                  <p
                    className={`text-xs truncate ${
                      chat.unread > 0
                        ? "text-slate-800 font-semibold"
                        : "text-slate-500"
                    }`}
                  >
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render the Active Chat View
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in slide-in-from-right-10 duration-200">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between safe-area-top pt-safe">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveChatId(null)}
            className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Avatar
              name={activeChat.partner.name}
              verified={activeChat.partner.verified}
              size="sm"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {activeChat.partner.name}
              </h3>
              <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                {activeChat.context.label} • {activeChat.context.status}
              </div>
              {activeChat.channel && (
                <div className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${CHANNEL_STYLES[activeChat.channel]}`}>
                  {CHANNEL_LABELS[activeChat.channel]}
                </div>
              )}
            {activeChat.context.productName && (
              <div className="text-[10px] text-slate-500 font-semibold">
                #{activeChat.context.productName}
              </div>
            )}
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Safety Reminder */}
      <div className="bg-slate-100 border-b border-slate-200 p-2 text-center">
        <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>Keep barter details inside Bitbit chat and report suspicious offers.</span>
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        <div className="text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Today
          </span>
        </div>

        {activeChat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3 text-sm relative shadow-sm
                ${
                  msg.sender === "me"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
                }
              `}
            >
              <p>{msg.text}</p>
              <div
                className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                  msg.sender === "me" ? "text-emerald-100" : "text-slate-400"
                }`}
              >
                {msg.time}
                {msg.sender === "me" && (
                  <CheckCheck size={12} className="opacity-70" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-3 pb-6 safe-area-bottom">
        <div className="flex items-end gap-2 max-w-md mx-auto">
          <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 bg-slate-100 rounded-2xl flex items-center gap-2 px-4 py-2 border border-transparent focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <input
              type="text"
              placeholder="Type a message..."
              className="bg-transparent w-full text-sm text-slate-900 focus:outline-none max-h-24 py-1"
            />
            <button className="text-slate-400 hover:text-emerald-600">
              <ImageIcon size={20} />
            </button>
          </div>
          <button className="p-3 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors active:scale-95">
            <Send size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
