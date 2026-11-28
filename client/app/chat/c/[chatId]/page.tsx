"use client";
import MessageCard from "@/components/chat/MessageCard";
import PromptInput from "@/components/chat/PromptInput";
import Sending from "@/components/chat/Sending";
import { StoredMessage } from "@/lib/db";
import { useChatStore } from "@/stores/chatStore";
import { useModelStore } from "@/stores/modelStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ChatPage() {
  const { chatId } = useParams();
  const { messages, getMessages } = useChatStore();
  const { activeModel } = useModelStore();
  const [promptInputValue, setPromptInputValue] = useState("");
  const [sending, setSending] = useState(false);

  const [pendingMessage, setPendingMessage] = useState<StoredMessage | null>(
    null,
  );

  const handleSend = async () => {
    if (!activeModel) return alert("Please select a model");
    console.log(promptInputValue);
    setPendingMessage({
      chatId: chatId as string,
      content: [{ type: "text", text: promptInputValue }],
      id: "something",
      role: "user",
      createdAt: Date.now(),
    });
  };
  useEffect(() => {
    getMessages(String(chatId));
  }, [chatId, getMessages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
        {pendingMessage && <MessageCard message={pendingMessage} />}
        {sending && <Sending />}
      </div>

      <PromptInput
        sending={sending}
        promptInputValue={promptInputValue}
        setPromptInputValue={setPromptInputValue}
        onSend={handleSend}
      />
    </div>
  );
}
