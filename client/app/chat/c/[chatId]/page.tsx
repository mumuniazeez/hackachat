"use client";
import { useChatStore } from "@/stores/chatStore";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

export default function ChatPage() {
  const { chatId } = useParams();
  const { messages, getMessages } = useChatStore();

  useEffect(() => {
    getMessages(String(chatId));
  }, [chatId, getMessages]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto"></div>
    </div>
  );
}
