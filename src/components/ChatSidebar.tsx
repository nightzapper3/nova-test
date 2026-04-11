import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Trash2, LogOut, Menu, X, Settings } from "lucide-react";
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
  activeId, onSelect, onNew, conversations, onDelete, onSignOut, userEmail,
}: ChatSidebarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg hover:bg-accent transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 bg-background/60 z-30" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed md:relative z-40 h-full w-[280px] flex flex-col bg-sidebar-background border-r border-sidebar-border transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors md:hidden">
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          </button>
          <button
            onClick={() => { onNew(); setOpen(false); }}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors ml-auto"
            title="New chat"
          >
            <Plus className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground px-3 py-2">Recent</p>
          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm",
                activeId === c.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              onClick={() => { onSelect(c.id); setOpen(false); }}
            >
              <span className="truncate flex-1">{c.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              {userEmail?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-xs text-sidebar-foreground truncate flex-1">{userEmail}</span>
            <Button variant="ghost" size="icon" onClick={onSignOut} className="h-8 w-8 shrink-0" title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
