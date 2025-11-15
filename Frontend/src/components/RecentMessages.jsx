import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/recent-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        // Group messages by sender and get the latest message for each sender
        const groupedMessages = data.messages.reduce((acc, message) => {
          const senderId = message.from_user_id._id;
          if (
            !acc[senderId] ||
            new Date(message.createdAt) > new Date(acc[senderId].createdAt)
          ) {
            acc[senderId] = message;
          }
          return acc;
        }, {});

        // Sort messages by date
        const sortedMessages = Object.values(groupedMessages).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setMessages(sortedMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecentMessages();
      const interval = setInterval(fetchRecentMessages, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 w-full rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <h3 className="font-semibold text-white text-sm">Recent Messages</h3>
      </div>

      {/* Messages List */}
      <div className="flex flex-col max-h-[500px] overflow-y-auto no-scrollbar">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Link
              to={`/messages/${message.from_user_id._id}`}
              key={index}
              className="flex items-start gap-3 px-6 py-4 hover:bg-zinc-800/50 transition-all duration-200 border-b border-zinc-800/50 last:border-b-0 group"
            >
              {/* Profile Picture with Online Indicator */}
              <div className="relative flex-shrink-0">
                <img
                  src={message.from_user_id.profile_picture}
                  alt={message.from_user_id.full_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-800 group-hover:ring-zinc-700 transition-all"
                />
                {!message.seen && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-zinc-900"></div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <p className="font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                    {message.from_user_id.full_name}
                  </p>
                  <p className="text-xs text-zinc-500 flex-shrink-0">
                    {moment(message.createdAt).fromNow()}
                  </p>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <p
                    className={`text-sm truncate ${
                      !message.seen
                        ? "text-zinc-300 font-medium"
                        : "text-zinc-500"
                    }`}
                  >
                    {message.text ? message.text : "📷 Media"}
                  </p>
                  {!message.seen && (
                    <div className="flex-shrink-0 bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-lg shadow-blue-500/50">
                      1
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-zinc-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm text-center font-medium">
              No messages yet
            </p>
            <p className="text-zinc-600 text-xs text-center mt-1">
              Start a conversation with someone
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {messages.length > 0 && (
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <Link
            to="/messages"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center justify-center gap-1 group"
          >
            View all messages
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentMessages;
