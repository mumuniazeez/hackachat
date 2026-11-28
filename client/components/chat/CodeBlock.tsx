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
    <div className="bg-[#0d1117] rounded p-2">
      <Button onClick={copy} className={"ms-auto"}>
        {copied ? "Copied" : "Copy"}
      </Button>
      <pre ref={preRef} className="rounded-4xl">
        {children}
      </pre>
    </div>
  );
}
