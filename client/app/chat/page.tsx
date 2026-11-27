"use client";
import MessageCard from "@/components/chat/MessageCard";
import PromptInput from "@/components/chat/PromptInput";
import Sending from "@/components/chat/Sending";
import { StoredMessage } from "@/lib/db";
import {
  Code2Icon,
  BookOpenIcon,
  RocketIcon,
  Lightbulb,
  Cpu,
} from "lucide-react";
import { useState } from "react";
import * as api from "@/lib/api";
import { useModelStore } from "@/stores/modelStore";
import { useAuthContext } from "@/context/AuthProvider";

export default function Page() {
  const topicSuggestions = [
    {
      topic: "CODE & TECH",
      icon: <Code2Icon size={"15px"} />,
      title: "Debug an error in my Code",
      details:
        "I have a bug in my code. Here is what I am trying to do. and what happened instead and the error...",
    },
    {
      topic: "LEARNING",
      icon: <BookOpenIcon size={"15px"} />,
      title: "Break down a tricky concept",
      details:
        "Can you explain how public-key cryptography works using an intuitive physical analogy without...",
    },
    {
      topic: "BUILDING",
      icon: <RocketIcon size={"15px"} />,
      title: "Plan a weekend hardware/web project",
      details:
        "I want to build a small weekend project with an ESP32 or a web scraper. Can you give me 3...",
    },
    {
      topic: "WRITTING",
      icon: <Lightbulb size={"15px"} />,
      title: "Review my essay arguement & tone",
      details:
        "Can you critique the reasoning and thesis statement of this essay draft? Tell me which claim...",
    },
    {
      topic: "Curiosity",
      icon: <Cpu size={"15px"} />,
      title: "Teach me how to make something under th hood",
      details:
        "How does an operating system kernel actually switch between running processess on CPU?",
    },
  ];

  const { activeModel } = useModelStore();
  const { user } = useAuthContext();

  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [sending, setSending] = useState(false);

  const [promptInputValue, setPromptInputValue] = useState("");

  const handleSend = async () => {
    if (!activeModel) return alert("Please selected a model");
    console.log(promptInputValue);
    setMessages((prev) => [
      ...prev,
      {
        chatId: "0",
        content: [{ type: "text", text: promptInputValue }],
        role: "user",
        createdAt: Date.now(),
        id: `${prev.length + 1}`,
      },
    ]);
    setPromptInputValue("");
    setSending(true);
    console.log(messages);

    const res = await api.chat.chatControllerSendMessage({
      auth: user?.access_token,
      body: {
        messages: [
          { role: "user", content: [{ type: "text", text: promptInputValue }] },
        ],
        modelConfig: {
          modelName: activeModel.id,
          responseDetailLevel: "balanced",
          temperatureOrCreativity: 0.5,
        },
        userData: { customInstruction: "", userIdentify: user?.name || "User" },
      },
    });
    console.log(res);
    if (res.error) {
      // handle error
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* <div className="flex justify-center items-center">
          <div className="p-10 px-30">
            <p className="p-1 border w-[140px] text-[10px] text-center">
              HACK CLUB THIRD SPACE
            </p>
            <h1 className="my-2 text-2xl">Watin you dey think tho?</h1>
            <p className="text-xs text-zinc-500">
              Ask a qestion, Debug code or pick a starter prompt below.
              Hackachat guide you step-by-step so you learn by doing.
            </p>
            <div className="grid col-span-2 grid-cols-2 shrink-0 gap-3 mt-3">
              {topicSuggestions.map((topics, idx) => (
                <div
                  key={idx}
                  className="border p-5 bg-muted/40 text-black gap-y-px text-left rounded-md cursor-pointer hover:bg-zinc-100 hover:border-black"
                >
                  <div className="flex text-start justify-start items-center m-2">
                    <span className="text-zinc-500">{topics.icon}</span>
                    <p className="text-[10px] ml-2 text-zinc-500">
                      {topics.topic}
                    </p>
                  </div>
                  <p className="text-[15px] ">{topics.title}</p>
                  <p className="text-[13px] text-zinc-500">{topics.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
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
