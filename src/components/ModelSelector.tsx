import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Zap, Brain, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIModel {
  id: string;
  label: string;
  provider: string;
  description: string;
  tier: "fast" | "balanced" | "powerful";
}

export const AI_MODELS: AIModel[] = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash", provider: "Google", description: "Fast & capable", tier: "fast" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", description: "Most powerful Gemini", tier: "powerful" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google", description: "Balanced speed & quality", tier: "balanced" },
  { id: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", provider: "Google", description: "Fastest & cheapest", tier: "fast" },
  { id: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro", provider: "Google", description: "Next-gen reasoning", tier: "powerful" },
  { id: "openai/gpt-5", label: "GPT-5", provider: "OpenAI", description: "Most capable GPT", tier: "powerful" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", provider: "OpenAI", description: "Fast & affordable", tier: "balanced" },
  { id: "openai/gpt-5-nano", label: "GPT-5 Nano", provider: "OpenAI", description: "Ultra fast", tier: "fast" },
  { id: "openai/gpt-5.2", label: "GPT-5.2", provider: "OpenAI", description: "Enhanced reasoning", tier: "powerful" },
];

const tierIcon = (tier: AIModel["tier"]) => {
  switch (tier) {
    case "fast": return <Zap className="h-3.5 w-3.5 text-yellow-500" />;
    case "balanced": return <Cpu className="h-3.5 w-3.5 text-blue-500" />;
    case "powerful": return <Brain className="h-3.5 w-3.5 text-purple-500" />;
  }
};

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];
  const providers = [...new Set(AI_MODELS.map((m) => m.provider))];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:bg-accent transition-colors"
      >
        {tierIcon(selected.tier)}
        <span className="hidden sm:inline">{selected.label}</span>
        <span className="sm:hidden">{selected.label.split(" ").slice(-1)}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-[340px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl z-50 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-medium text-foreground">Select a model</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Choose the best model for your task</p>
          </div>

          {/* Model list */}
          <div className="max-h-[280px] overflow-y-auto py-1">
            {providers.map((provider) => (
              <div key={provider}>
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  {provider}
                </p>
                {AI_MODELS.filter((m) => m.provider === provider).map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => { onModelChange(model.id); setOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/60 transition-colors",
                      model.id === selectedModel && "bg-accent/80"
                    )}
                  >
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-muted/50 shrink-0">
                      {tierIcon(model.tier)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground block">{model.label}</span>
                      <span className="text-[11px] text-muted-foreground">{model.description}</span>
                    </div>
                    {model.id === selectedModel && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
