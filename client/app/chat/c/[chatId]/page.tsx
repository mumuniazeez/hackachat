"use client";
import MessageCard from "@/components/chat/MessageCard";
import PromptInput from "@/components/chat/PromptInput";
import Sending from "@/components/chat/Sending";
import { StoredMessage } from "@/lib/db";
import { useChatStore } from "@/stores/chatStore";
import { useModelStore } from "@/stores/modelStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { useAuthContext } from "@/context/AuthProvider";

export default function ChatPage() {
  const { chatId } = useParams();
  const { messages, getMessages, addMessage } = useChatStore();
  const { activeModel } = useModelStore();
  const { user } = useAuthContext();
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
    setPromptInputValue("");
    setSending(true);

    console.log(pendingMessage?.content);
    const res = await api.chat.chatControllerSendMessage({
      auth: user?.access_token,
      body: {
        messages: [
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: "user", content: [{ type: "text", text: promptInputValue }] },
        ],
        modelConfig: {
          modelName: activeModel.id,
          responseDetailLevel: "balanced",
          temperatureOrCreativity: 0.5,
        },
        userData: { userIdentify: user?.name || "User", customInstruction: "" },
      },
    });

    console.log(res);

    if (res.error || !res.data) {
      // handle error
    } else {
      await addMessage(chatId as string, {
        role: "user",
        content: [{ type: "text", text: promptInputValue }] ,
      });
      setPendingMessage(null);
      await addMessage(chatId as string, {
        role: "assistant",
        content: [{ type: "text", text: res.data.response.content.text }],
      });
    }

    setSending(false);
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
