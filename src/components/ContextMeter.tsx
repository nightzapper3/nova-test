import { Brain } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ContextMeterProps {
  messages: { role: string; content: string }[];
  maxTokens?: number;
}

const estimateTokens = (text: string) => Math.ceil(text.length / 4);

const ContextMeter = ({ messages, maxTokens = 128000 }: ContextMeterProps) => {
  const totalTokens = messages.reduce(
    (sum, m) => sum + estimateTokens(m.content),
    0
  );
  const percentage = Math.min((totalTokens / maxTokens) * 100, 100);

  const getColor = () => {
    if (percentage > 80) return "bg-destructive";
    if (percentage > 50) return "bg-yellow-500";
    return "bg-primary";
  };

  const getLabel = () => {
    if (percentage > 80) return "Context nearly full";
    if (percentage > 50) return "Context half used";
    return "Context available";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 cursor-help">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${getColor()}`}
              style={{ width: `${Math.max(percentage, 2)}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {Math.round(percentage)}%
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">
          {getLabel()} — ~{totalTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ContextMeter;
