import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Copy, Dot } from "lucide-react";

export default function Sending() {
  return (
    <div className="border-y py-10 px-20 space-y-5">
      <div className="flex items-center justify-between">
        <Badge variant="default">Hackachat</Badge>
      </div>

      <div className="rounded-4xl bg-black text-white flex items-end w-fit">
        <Dot className="animate-bounce" />
        <Dot className="animate-bounce delay-150" />
        <Dot className="animate-bounce delay-300" />
      </div>
    </div>
  );
}
