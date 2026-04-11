import { useState, useRef, useEffect, useMemo } from "react";
import { type Message, streamChat } from "@/lib/chat";
import ChatMessage from "@/components/ChatMessage";
import ThinkingIndicator from "@/components/ThinkingIndicator";
import ContextMeter from "@/components/ContextMeter";
import DarkModeToggle from "@/components/DarkModeToggle";
import ChatSidebar from "@/components/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import Auth from "./Auth";

const GREETINGS = [
  "What can I help with?",
  "How can I help you today?",
  "What's on your mind?",
  "Ready when you are.",
  "What shall we explore?",
  "Let's create something.",
  "Ask me anything.",
  "What do you need?",
];

const SUGGESTION_CHIPS = [
  { label: "Write", icon: "✍️" },
  { label: "Plan", icon: "📋" },
  { label: "Research", icon: "🔍" },
  { label: "Learn", icon: "💡" },
];

const ChatPage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    conversations, activeId, messages, setMessages,
    selectConversation, createConversation, newChat,
    saveMessage, deleteConversation, updateTitle,
  } = useConversations(user?.id);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const greeting = useMemo(
    () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
    [activeId]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return <Auth />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    let convId = activeId;
    if (!convId) {
      convId = await createConversation(text);
      if (!convId) return;
    }

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    await saveMessage(convId, userMsg);
    if (messages.length === 0 && activeId) updateTitle(convId, text);

    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: updateAssistant,
        onDone: async () => {
          setIsLoading(false);
          if (convId && assistantContent) await saveMessage(convId, { role: "assistant", content: assistantContent });
        },
        onError: (err) => {
          setIsLoading(false);
          toast({ title: "Error", description: err, variant: "destructive" });
        },
      });
    } catch {
      setIsLoading(false);
      toast({ title: "Error", description: "Failed to connect to AI", variant: "destructive" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  const handleChipClick = (label: string) => {
    setInput(`Help me ${label.toLowerCase()}`);
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      <ChatSidebar
        activeId={activeId}
        onSelect={selectConversation}
        onNew={newChat}
        conversations={conversations}
        onDelete={deleteConversation}
        onSignOut={signOut}
        userEmail={user.email}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-2 ml-12 md:ml-0">
            <h1 className="text-lg font-semibold text-foreground">Nova</h1>
          </div>
          <div className="flex items-center gap-2">
            <ContextMeter messages={messages} />
            <DarkModeToggle />
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-light tracking-tight gemini-gradient-text mb-16 leading-tight">
                  {greeting}
                </h2>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    message={msg}
                    isNew={i >= messages.length - 2}
                    isStreaming={isLoading && msg.role === "assistant" && i === messages.length - 1}
                  />
                ))}
                {isLoading && messages[messages.length - 1]?.role !== "assistant" && <ThinkingIndicator />}
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="px-4 pb-6 pt-2">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/30">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Nova"
                  rows={1}
                  className="w-full resize-none px-6 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground bg-transparent focus:outline-none max-h-32 min-h-[44px]"
                  style={{ height: "auto", overflow: "hidden" }}
                  onInput={(e) => {
                    const t = e.currentTarget;
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 128) + "px";
                  }}
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <div />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>

            {/* Suggestion chips */}
            {messages.length === 0 && (
              <div className="flex items-center justify-center gap-2 mt-4 animate-fade-in">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleChipClick(chip.label)}
                    className="px-4 py-2 rounded-full border border-border bg-card text-sm text-foreground hover:bg-accent transition-colors duration-200"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground mt-3">
              Nova can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
