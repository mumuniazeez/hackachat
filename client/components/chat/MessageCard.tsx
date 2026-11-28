import { StoredMessage } from "@/lib/db";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Copy, Pen, RefreshCcw } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";

import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import CodeBlock from "./CodeBlock";

export default function MessageCard({ message }: { message: StoredMessage }) {
  return (
    <div className="border-y py-10 px-20 space-y-5 group">
      <div className="flex items-center justify-between">
        <Badge variant={message.role === "user" ? "secondary" : "default"}>
          {message.role === "user" ? "You" : "Hackachat"}
        </Badge>
        <div className="group-hover:block hidden">
          <Button variant={"ghost"}>
            <Copy /> Copy
          </Button>
        </div>
      </div>
      {message.content.map((part, idx) =>
        part.type === "text" ? (
          <ReactMarkdown
            key={idx}
            remarkPlugins={[
              remarkGfm,
              [remarkMath, { singleDollarTextMath: false }],
            ]}
            rehypePlugins={[rehypeKatex, [rehypeHighlight, { detect: false }]]}
            components={{ pre: CodeBlock }}
          >
            {part.text}
          </ReactMarkdown>
        ) : (
          <Image key={idx} src={part.data} alt="Chat images" />
        ),
      )}
    </div>
  );
}
