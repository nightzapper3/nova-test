import { Brain } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ContextMeterProps {
  messages: { role: string; content: string }[];
  maxTokens?: number;
}

const estimateTokens = (text: string) => Math.ceil(text.length / 4);

const ContextMeter = ({ messages, maxTokens = 128000 }: ContextMeterProps) => {
  const totalTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
  const percentage = Math.min((totalTokens / maxTokens) * 100, 100);

  const getColor = () => {
    if (percentage > 80) return "bg-destructive";
    if (percentage > 50) return "bg-yellow-500";
    return "bg-primary";
  };

  if (messages.length === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 cursor-help px-2 py-1 rounded-lg hover:bg-accent transition-colors">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${getColor()}`}
              style={{ width: `${Math.max(percentage, 2)}%` }}
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">~{totalTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ContextMeter;
