"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Bot, User, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  matchedLinks?: MatchedLink[];
}

interface MatchedLink {
  id: string;
  url: string;
  title: string | null;
  faviconUrl: string | null;
  isFavorite: boolean;
}

interface ChatPanelProps {
  allLinks?: MatchedLink[];
}

export function ChatPanel({ allLinks = [] }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const query = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error },
        ]);
      } else {
        // Find the matched links from our data
        const matchedLinks = (data.matchedLinkIds || [])
          .map((id: string) => allLinks.find((l) => l.id === id))
          .filter(Boolean) as MatchedLink[];

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            matchedLinks,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-accent-primary/15 flex items-center justify-center mb-4">
              <Bot size={28} className="text-accent-primary" />
            </div>
            <h3 className="text-lg font-bold font-[family-name:var(--font-rajdhani)] text-foreground mb-2">
              Ask the Vault
            </h3>
            <p className="text-sm text-foreground-muted max-w-xs">
              Ask me anything about your saved links. Try &ldquo;find that React tutorial&rdquo;
              or &ldquo;show me design resources&rdquo;.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", msg.role === "user" && "justify-end")}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={16} className="text-accent-primary" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                msg.role === "user"
                  ? "bg-accent-primary/20 text-foreground"
                  : "bg-surface text-foreground-secondary"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

              {/* Matched Link Cards */}
              {msg.matchedLinks && msg.matchedLinks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.matchedLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary border border-border-custom hover:border-border-hover transition-all group"
                    >
                      {link.faviconUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={link.faviconUrl}
                          alt=""
                          className="w-5 h-5 rounded"
                        />
                      ) : (
                        <ExternalLink
                          size={16}
                          className="text-foreground-muted"
                        />
                      )}
                      <span className="text-sm text-foreground flex-1 truncate group-hover:text-accent-primary transition-colors">
                        {link.title || link.url}
                      </span>
                      <ExternalLink
                        size={14}
                        className="text-foreground-muted shrink-0"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-accent-chakra/15 flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} className="text-accent-chakra" />
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-accent-primary" />
            </div>
            <div className="bg-surface rounded-2xl px-4 py-3">
              <Loader2
                size={16}
                className="animate-spin text-accent-primary"
              />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-border-custom"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your saved links..."
            className="input flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
