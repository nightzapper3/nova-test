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
  "How can I help you today?",
  "What's on your mind?",
  "Ready to brainstorm something?",
  "What shall we explore together?",
  "Got a question? I'm all ears!",
  "Let's create something amazing!",
  "What can I do for you?",
  "Need help with anything?",
];

const ChatPage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    conversations,
    activeId,
    messages,
    setMessages,
    selectConversation,
    createConversation,
    newChat,
    saveMessage,
    deleteConversation,
    updateTitle,
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
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="h-12 w-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
            <Sparkles className="h-6 w-6 text-primary-foreground animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
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

    // Create or use existing conversation
    let convId = activeId;
    if (!convId) {
      convId = await createConversation(text);
      if (!convId) return;
    }

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    await saveMessage(convId, userMsg);

    // If first message, title is already set from createConversation
    if (messages.length === 0 && activeId) {
      updateTitle(convId, text);
    }

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
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
          if (convId && assistantContent) {
            await saveMessage(convId, { role: "assistant", content: assistantContent });
          }
        },
        onError: (err) => {
          setIsLoading(false);
          toast({ title: "Error", description: err, variant: "destructive" });
        },
      });
    } catch {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to connect to AI",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen bg-background transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary opacity-[0.06] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent opacity-[0.06] blur-3xl" />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        activeId={activeId}
        onSelect={selectConversation}
        onNew={newChat}
        conversations={conversations}
        onDelete={deleteConversation}
        onSignOut={signOut}
        userEmail={user.email}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 glass-strong border-b border-border/50 z-10">
          <div className="flex items-center gap-2 ml-12 md:ml-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-md">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold gradient-text">Nova AI</h1>
              <p className="text-xs text-muted-foreground">
                Creative • Intuitive • Intelligent
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ContextMeter messages={messages} />
            <DarkModeToggle />
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center pt-20 text-center animate-fade-in">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl gradient-bg mb-6 shadow-xl">
                  <Sparkles className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold gradient-text mb-3">
                  {greeting}
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  I'm Nova, your creative AI assistant. Ask me anything — I can
                  help with writing, coding, analysis, brainstorming, and much
                  more.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                message={msg}
                isNew={i >= messages.length - 2}
                isStreaming={isLoading && msg.role === "assistant" && i === messages.length - 1}
              />
            ))}
            {isLoading &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <ThinkingIndicator />
              )}
          </div>
        </div>

        {/* Input */}
        <div className="glass-strong border-t border-border/50 px-4 py-3 z-10">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl flex gap-2 items-end"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none rounded-xl glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring max-h-32 min-h-[44px] transition-all duration-200 border-0"
              style={{ height: "auto", overflow: "hidden" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 128) + "px";
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-11 w-11 rounded-xl shrink-0 gradient-bg text-primary-foreground shadow-md hover:scale-105 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
