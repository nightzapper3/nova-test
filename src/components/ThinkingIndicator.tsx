import { Sparkles } from "lucide-react";

const ThinkingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full glass text-muted-foreground shadow-sm">
        <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: "3s" }} />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms] [animation-duration:1.4s]" />
            <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce [animation-delay:200ms] [animation-duration:1.4s]" />
            <span className="h-2 w-2 rounded-full bg-secondary/60 animate-bounce [animation-delay:400ms] [animation-duration:1.4s]" />
          </div>
          <span className="text-xs text-muted-foreground ml-1 animate-pulse">Thinking…</span>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
