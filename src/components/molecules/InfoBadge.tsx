import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

type InfoBadgeProps = {
  icon?: React.ReactNode;
  text: string;
  className?: string;
};

export default function InfoBadge({ icon, text, className }: InfoBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("bg-white/10 border-white/20 text-white backdrop-blur-sm", className)}
    >
      {icon && <span className="mr-1.5 h-4 w-4">{icon}</span>}
      {text}
    </Badge>
  );
}