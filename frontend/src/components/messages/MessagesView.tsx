import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  User,
  MessageSquare,
  MessageCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

const CURRENT_USER_ID = 1; // TODO: Replace with real user id from auth

const demoUsers = [
  { id: 1, name: "You" },
  { id: 2, name: "Alice" },
  { id: 3, name: "Bob" },
];
const demoGroups = [
  { id: 1, name: "Math Study Group" },
  { id: 2, name: "Physics Team" },
];

type MessageType = "public" | "private" | "group";

interface ApiMessage {
  id: number;
  sender_id: number;
  recipient_id?: number;
  group_id?: number;
  content: string;
  type: MessageType;
  timestamp: string;
}

const fallbackMessages = {
  public: [
    {
      id: 1,
      sender_id: 2,
      content: "Welcome to the public chat!",
      type: "public" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: 2,
      sender_id: 3,
      content: "Hi everyone! Ready for the study session?",
      type: "public" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
      id: 3,
      sender_id: 1,
      content: "Absolutely! Let's get started.",
      type: "public" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    },
  ],
  private: [
    {
      id: 4,
      sender_id: 2,
      recipient_id: 1,
      content: "Hey, are you coming to the study session tonight?",
      type: "private" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: 5,
      sender_id: 1,
      recipient_id: 2,
      content: "Yes, I'll be there!",
      type: "private" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
    },
    {
      id: 6,
      sender_id: 2,
      recipient_id: 1,
      content: "Great! See you at 7 PM.",
      type: "private" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ],
  group: [
    {
      id: 7,
      sender_id: 3,
      group_id: 1,
      content:
        "Can anyone help me solve this math question: What is the integral of x^2?",
      type: "group" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 8,
      sender_id: 2,
      group_id: 1,
      content: "Sure! The answer is (1/3)x^3 + C.",
      type: "group" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    },
    {
      id: 9,
      sender_id: 1,
      group_id: 1,
      content: "Thanks! That makes sense.",
      type: "group" as MessageType,
      timestamp: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
    },
  ],
};

const MessagesView: React.FC = () => {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"public" | "private" | "group">("public");
  const [recipientId, setRecipientId] = useState<number>(2); // default to Alice
  const [groupId, setGroupId] = useState<number>(1); // default to first group
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use only static fallbackMessages
  useEffect(() => {
    setMessages((fallbackMessages[type] as ApiMessage[]).slice().reverse());
    setError(null);
    setLoading(false);
    // eslint-disable-next-line
  }, [type, groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // Add new message to static messages
    const msg: ApiMessage = {
      id: Date.now(),
      sender_id: 1, // You
      content: newMessage,
      type: type as "public" | "private" | "group",
      timestamp: new Date().toISOString(),
      ...(type === "private" ? { recipient_id: recipientId } : {}),
      ...(type === "group" ? { group_id: groupId } : {}),
    };
    setMessages([msg, ...messages]);
    setNewMessage("");
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen relative">
      {/* Vibrant header */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-6 flex flex-col sm:flex-row items-center justify-between shadow-lg relative overflow-hidden border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
        <div className="flex items-center gap-4">
          <MessageCircle
            size={48}
            className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"
          />
          <div>
            <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] flex items-center gap-2">
              Messages
            </h2>
            <p className="text-blue-200 mt-2 text-lg font-medium drop-shadow">
              Chat with your study buddies and groups.
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <Card className="backdrop-blur bg-gray-800/50 border border-blue-500/20 shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/40 transition-all duration-300 mb-8 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white">Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 animate-fadeIn"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <User size={20} />
                </div>
                <div>
                  <div className="bg-gray-700/50 rounded-lg px-4 py-2 shadow text-blue-200 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                    {msg.content}
                  </div>
                  <div className="text-xs text-blue-300 mt-1">
                    {msg.sender_id === CURRENT_USER_ID
                      ? "You"
                      : demoUsers.find((u) => u.id === msg.sender_id)
                          ?.name}{" "}
                    • {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl flex items-center gap-2 z-50">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded-full px-4 py-3 border border-blue-500/20 shadow bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-blue-200 placeholder-blue-300/50"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
        />
        <button
          onClick={handleSendMessage}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full p-3 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center border border-blue-500/20 hover:border-blue-500/40"
          title="Send Message"
        >
          <Send size={24} className="text-blue-200" />
        </button>
      </div>
    </div>
  );
};

export default MessagesView;
