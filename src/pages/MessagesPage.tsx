import React, { useEffect, useState, useRef } from "react";
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
import { Card, Avatar } from "@/components/ui";
import { Conversation, ChatChannel } from "@/types/chat";
import { chatService } from "@/services/chatService";

const CHANNEL_LABELS: Record<ChatChannel, string> = {
  pasabuy: "Pasabuy",
  traveler: "Traveler Swap",
  host: "Swap Host",
};

const CHANNEL_STYLES: Record<ChatChannel, string> = {
  pasabuy: "bg-purple-50 border-purple-100 text-purple-700",
  traveler: "bg-emerald-50 border-emerald-100 text-emerald-700",
  host: "bg-blue-50 border-blue-100 text-blue-700",
};

const TAB_OPTIONS = [
  { id: "all", label: "All Chats" },
  { id: "traveler", label: "Traveler" },
  { id: "pasabuy", label: "Pasabuy" },
  { id: "host", label: "Swap Hosts" },
] as const;

export const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const routeState = location.state as {
    conversationId?: string;
    chatType?: string;
    linkedTag?: string;
    productTag?: string;
  } | null;
  const highlightedProductTag = routeState?.productTag ?? routeState?.linkedTag ?? null;

  useEffect(() => {
    chatService.getConversations().then((data) => {
      setConversations(data);
    });
  }, []);

  useEffect(() => {
    const { conversationId, chatType, linkedTag } = routeState ?? {};
    let timeoutId: number | undefined;

    if (conversationId) {
      timeoutId = window.setTimeout(() => {
        setActiveChatId(conversationId);
        setActiveTab(chatType ?? "all");
      }, 0);
      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }

    if (linkedTag && conversations.length > 0) {
      const linkedByTag = conversations.find((chat) => chat.context?.label === linkedTag);
      if (linkedByTag) {
        timeoutId = window.setTimeout(() => {
          setActiveChatId(linkedByTag.id);
          setActiveTab(chatType ?? linkedByTag.channel ?? "all");
        }, 0);
      }
      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }

    if (chatType && chatType !== "all") {
      timeoutId = window.setTimeout(() => {
        setActiveTab(chatType);
      }, 0);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [routeState, conversations]);

  const activeChat = conversations.find((c) => c.id === activeChatId);

  // Auto-scroll when messages change in active chat
  useEffect(() => {
    if (activeChatId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages.length, activeChatId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const textToSend = inputText;
    setInputText("");

    try {
      const response = await chatService.sendMessage({
        conversationId: activeChatId,
        text: textToSend,
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              lastMessage: response.message.text,
              timestamp: "Just now",
              messages: [...c.messages, response.message],
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((chat) => {
    const matchesTab = activeTab === "all" || chat.channel === activeTab;
    const matchesSearch =
      searchQuery.trim().length === 0 ||
      chat.partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.context.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const renderSearchAndTabs = () => (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations, orders, travelers..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition-all"
        />
      </div>

      <div className="flex p-1 bg-slate-200/60 rounded-xl overflow-x-auto no-scrollbar">
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
              activeTab === tab.id
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderConversationItems = () => {
    if (filteredConversations.length === 0) {
      return (
        <div className="py-12 text-center text-slate-400">
          <p className="text-sm font-medium">No messages found.</p>
        </div>
      );
    }

    return filteredConversations.map((chat) => {
      const isSelected = activeChatId === chat.id;

      return (
        <div
          key={chat.id}
          onClick={() => setActiveChatId(chat.id)}
          className={`p-3.5 rounded-2xl flex gap-3.5 items-start cursor-pointer transition-all border ${
            isSelected
              ? "bg-emerald-50/60 border-emerald-300 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-emerald-200 hover:bg-slate-50/60"
          }`}
        >
          <div className="relative shrink-0">
            <Avatar
              name={chat.partner.name}
              verified={chat.partner.verified}
              size="md"
            />
            {chat.partner.status === "online" && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
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
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {chat.context.label}
              </span>
              {chat.channel && (
                <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${CHANNEL_STYLES[chat.channel]}`}>
                  {CHANNEL_LABELS[chat.channel]}
                </span>
              )}
              {chat.context.productName && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700 truncate max-w-[140px]">
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
                    ? "text-slate-900 font-semibold"
                    : "text-slate-500"
                }`}
              >
                {chat.lastMessage}
              </p>
              {chat.unread > 0 && (
                <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1 shrink-0">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderChatView = (isDesktop = false) => {
    if (!activeChat) return null;

    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            {!isDesktop && (
              <button
                type="button"
                onClick={() => setActiveChatId(null)}
                className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer transition-colors"
                aria-label="Back to messages"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex items-center gap-3">
              <Avatar
                name={activeChat.partner.name}
                verified={activeChat.partner.verified}
                size="sm"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  {activeChat.partner.name}
                </h3>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  {activeChat.context.label} • {activeChat.context.status}
                </div>
                {activeChat.channel && (
                  <div className={`mt-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${CHANNEL_STYLES[activeChat.channel]}`}>
                    {CHANNEL_LABELS[activeChat.channel]}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button 
            type="button"
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Chat options"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Safety Reminder */}
        <div className="bg-slate-100 border-b border-slate-200/80 px-3 py-1.5 text-center shrink-0">
          <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1 font-medium">
            <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
            <span>Keep barter details inside Bitbit chat and report suspicious offers.</span>
          </p>
        </div>

        {/* Messages Area - constrained on desktop for ergonomics */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">
              Today
            </span>
          </div>

          <div className="max-w-2xl mx-auto space-y-3 w-full">
            {activeChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm relative shadow-xs
                    ${
                      msg.sender === "me"
                        ? "bg-emerald-600 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                    }
                  `}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-3 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-2xl mx-auto">
            <button 
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Attach file"
            >
              <Paperclip size={18} />
            </button>
            <div className="flex-1 bg-slate-100 rounded-2xl flex items-center gap-2 px-3.5 py-1.5 border border-transparent focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="bg-transparent w-full text-sm text-slate-900 focus:outline-none py-1 placeholder:text-slate-400"
              />
              <button 
                type="button"
                className="text-slate-400 hover:text-emerald-600 p-1 cursor-pointer transition-colors"
                aria-label="Attach image"
              >
                <ImageIcon size={18} />
              </button>
            </div>
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer ${
                inputText.trim()
                  ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700"
                  : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderEmptyDesktopChat = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
        <Send size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Select a Conversation</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1">
        Choose a trade or pasabuy partner from the list on the left to coordinate your exchange.
      </p>
    </div>
  );

  return (
    <div className="py-4 md:py-6 animate-in fade-in pb-20 md:pb-6">
      {/* Mobile view (< md) */}
      <div className="md:hidden">
        {activeChatId && activeChat ? (
          <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col">
            {renderChatView(false)}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Page Header */}
            <div className="flex justify-between items-center px-1">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                <p className="text-xs text-slate-500">Coordinate trades and pasabuy requests</p>
              </div>
              <div className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
                {conversations.filter((c) => c.unread > 0).length} New
              </div>
            </div>

            {renderSearchAndTabs()}

            {/* Conversation List */}
            <div className="space-y-3">
              {renderConversationItems()}
            </div>
          </div>
        )}
      </div>

      {/* Desktop view (>= md) */}
      <div className="hidden md:flex gap-6 h-[calc(100vh-9.5rem)] min-h-[500px]">
        {/* Left column: Conversations */}
        <div className="w-80 lg:w-96 shrink-0 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Messages</h1>
                <p className="text-xs text-slate-500">Coordinate trades & pasabuys</p>
              </div>
              <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {conversations.filter((c) => c.unread > 0).length} New
              </div>
            </div>
            {renderSearchAndTabs()}
          </div>
          <div className="flex-1 overflow-y-auto p-3 pr-2 space-y-2">
            {renderConversationItems()}
          </div>
        </div>

        {/* Right column: Active Chat or Empty State */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {activeChat ? (
            renderChatView(true)
          ) : (
            renderEmptyDesktopChat()
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
