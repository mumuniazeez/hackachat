import React from "react";
import { Input } from "../ui/input";
import { SendHorizontal } from "lucide-react";
import { Button } from "../ui/button";

export default function PromptInput({
  promptInputValue,
  setPromptInputValue,
  onSend,
}: {
  promptInputValue: string;
  setPromptInputValue: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="shrink-0 flex p-3 border-t border-border flex-col justify-center items-center px-20">
      <form
        className="border-zinc-400 border w-full rounded-md"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <Input
          type="text"
          placeholder="Message Hackachat.. (Enter to Send)"
          className="border-0 m-0 rounded-0 shadow-none rounded-none"
          value={promptInputValue}
          onChange={(e) => setPromptInputValue(e.target.value)}
          required
        />
        {/* <textarea
            className="w-full h-5 border-0"
            placeholder="Message Hackachat.. (Enter to Send)"
            draggable="false"
          /> */}
        <div className="flex justify-between items-center p-2 border-t">
          <p className="text-xs">Enter</p>
          <Button type="submit">
            <SendHorizontal size={15} />
          </Button>
        </div>
      </form>
    </div>
  );
}
