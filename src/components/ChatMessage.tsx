import { type Message } from "@/lib/chat";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isNew?: boolean;
  isStreaming?: boolean;
}

const ChatMessage = ({ message, isNew = false, isStreaming = false }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} ${
        isNew ? "animate-fade-in" : ""
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 shadow-sm ${
          isUser
            ? "gradient-bg text-primary-foreground"
            : "glass text-muted-foreground"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 transition-all duration-200 ${
          isUser
            ? "gradient-bg text-primary-foreground rounded-tr-sm shadow-lg"
            : "glass text-foreground rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted prose-pre:text-foreground prose-code:text-primary prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-[3px] h-[1.1em] bg-primary rounded-sm align-middle ml-0.5 animate-blink" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
