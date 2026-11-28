"use client";
import React, { ReactNode, useRef, useState } from "react";
import { Button } from "../ui/button";

export default function CodeBlock({ children }: { children?: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(preRef.current?.textContent ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="code-block">
      <Button onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}
