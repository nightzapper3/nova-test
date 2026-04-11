import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIModel {
  id: string;
  label: string;
  provider: string;
  description: string;
}

export const AI_MODELS: AIModel[] = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash", provider: "Google", description: "Fast & capable" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", description: "Most powerful Gemini" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google", description: "Balanced speed & quality" },
  { id: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", provider: "Google", description: "Fastest & cheapest" },
  { id: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro", provider: "Google", description: "Next-gen reasoning" },
  { id: "openai/gpt-5", label: "GPT-5", provider: "OpenAI", description: "Most capable GPT" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", provider: "OpenAI", description: "Fast & affordable" },
  { id: "openai/gpt-5-nano", label: "GPT-5 Nano", provider: "OpenAI", description: "Ultra fast" },
  { id: "openai/gpt-5.2", label: "GPT-5.2", provider: "OpenAI", description: "Enhanced reasoning" },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];
  const providers = [...new Set(AI_MODELS.map((m) => m.provider))];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:bg-accent transition-colors"
      >
        {selected.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-border bg-card shadow-lg z-50 py-1 animate-fade-in max-h-80 overflow-y-auto">
            {providers.map((provider) => (
              <div key={provider}>
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {provider}
                </p>
                {AI_MODELS.filter((m) => m.provider === provider).map((model) => (
                  <button
                    key={model.id}
                    onClick={() => { onModelChange(model.id); setOpen(false); }}
                    className={cn(
                      "w-full flex flex-col px-3 py-2 text-left hover:bg-accent transition-colors",
                      model.id === selectedModel && "bg-accent"
                    )}
                  >
                    <span className="text-sm text-foreground">{model.label}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;
