import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Trash2, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface ChatSidebarProps {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  conversations: Conversation[];
  onDelete: (id: string) => void;
  onSignOut: () => void;
  userEmail?: string;
}

const ChatSidebar = ({
  activeId,
  onSelect,
  onNew,
  conversations,
  onDelete,
  onSignOut,
  userEmail,
}: ChatSidebarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-xl glass"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-background/50 backdrop-blur-sm z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-40 h-full w-72 flex flex-col glass-strong border-r border-border/50 transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* New Chat Button */}
        <div className="p-3 pt-4">
          <Button
            onClick={() => { onNew(); setOpen(false); }}
            className="w-full h-11 rounded-xl gradient-bg text-primary-foreground font-medium gap-2 hover:scale-[1.02] transition-all duration-200 shadow-md"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-sm",
                activeId === c.id
                  ? "glass gradient-border bg-primary/10 text-foreground font-medium"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
              onClick={() => { onSelect(c.id); setOpen(false); }}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate flex-1">{c.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* User section */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold">
              {userEmail?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-xs text-muted-foreground truncate flex-1">
              {userEmail}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSignOut}
              className="h-8 w-8 shrink-0"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
