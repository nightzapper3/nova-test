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
    <div className={`flex gap-4 ${isNew ? "animate-fade-in" : ""} ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-1">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className={`${isUser ? "max-w-[70%]" : "flex-1 max-w-none"}`}>
        {isUser ? (
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:my-2 prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-xl prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-headings:font-semibold text-foreground">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
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
