"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Send, Bot, User, Square, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  matchedLinks?: MatchedLink[];
  isStreaming?: boolean;
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom(loading ? "auto" : "smooth");
  }, [messages, loading, scrollToBottom]);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  function handleStop() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const newArr = [...prev];
      const lastIndex = newArr.length - 1;
      if (newArr[lastIndex]?.role === "assistant") {
        newArr[lastIndex] = {
          ...newArr[lastIndex],
          isStreaming: false,
        };
      }
      return newArr;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const query = input.trim();
    setInput("");

    // Add user message and a placeholder assistant message for streaming
    setMessages((prev) => [
      ...prev,
      { role: "user", content: query },
      { role: "assistant", content: "", isStreaming: true },
    ]);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let errorMessage = "Failed to process question";
        try {
          const errData = await res.json();
          errorMessage = errData.error || errorMessage;
        } catch {
          // Response was not JSON
        }
        setMessages((prev) => {
          const newArr = [...prev];
          const last = newArr[newArr.length - 1];
          if (last && last.role === "assistant") {
            newArr[newArr.length - 1] = {
              role: "assistant",
              content: errorMessage,
              isStreaming: false,
            };
          }
          return newArr;
        });
        return;
      }

      if (!res.body) {
        throw new Error("No response stream available");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          const line = block.trim();
          if (!line.startsWith("data: ")) continue;
          const dataStr = line.replace(/^data:\s*/, "");
          if (!dataStr) continue;

          try {
            const event = JSON.parse(dataStr);

            if (event.type === "delta" && typeof event.content === "string") {
              setMessages((prev) => {
                const newArr = [...prev];
                const last = newArr[newArr.length - 1];
                if (last && last.role === "assistant") {
                  newArr[newArr.length - 1] = {
                    ...last,
                    content: last.content + event.content,
                  };
                }
                return newArr;
              });
            } else if (event.type === "matches" && Array.isArray(event.matchedLinkIds)) {
              const matchedLinks = event.matchedLinkIds
                .map((id: string) => allLinks.find((l) => l.id === id))
                .filter(Boolean) as MatchedLink[];

              setMessages((prev) => {
                const newArr = [...prev];
                const last = newArr[newArr.length - 1];
                if (last && last.role === "assistant") {
                  newArr[newArr.length - 1] = {
                    ...last,
                    matchedLinks,
                  };
                }
                return newArr;
              });
            } else if (event.type === "error") {
              setMessages((prev) => {
                const newArr = [...prev];
                const last = newArr[newArr.length - 1];
                if (last && last.role === "assistant") {
                  newArr[newArr.length - 1] = {
                    ...last,
                    content: event.error || "An error occurred.",
                  };
                }
                return newArr;
              });
            }
          } catch {
            // Ignore JSON parse errors for non-JSON or partial stream frames
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // User intentionally aborted the stream
        return;
      }
      setMessages((prev) => {
        const newArr = [...prev];
        const last = newArr[newArr.length - 1];
        if (last && last.role === "assistant") {
          newArr[newArr.length - 1] = {
            ...last,
            content:
              last.content || "Sorry, something went wrong. Please try again.",
            isStreaming: false,
          };
        }
        return newArr;
      });
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
      setMessages((prev) => {
        const newArr = [...prev];
        const last = newArr[newArr.length - 1];
        if (last && last.role === "assistant") {
          newArr[newArr.length - 1] = {
            ...last,
            isStreaming: false,
          };
        }
        return newArr;
      });
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 relative">
            <span
              className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-mincho)] font-bold text-[9rem] leading-none pointer-events-none select-none"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px rgba(157,92,255,0.14)",
              }}
              aria-hidden
            >
              問
            </span>
            <div className="relative w-16 h-16 mb-4">
              <div className="cursed-ring absolute -inset-1.5" />
              <div className="absolute inset-0 rounded-2xl bg-accent-cursed/15 border border-accent-cursed/40 flex items-center justify-center glow-purple">
                <Bot size={28} className="text-accent-hollow" />
              </div>
            </div>
            <h3 className="relative text-xl font-[family-name:var(--font-rajdhani)] tracking-[0.08em] text-foreground mb-2">
              Ask the Vault Spirit
            </h3>
            <p className="relative text-sm text-foreground-muted max-w-xs">
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
              <div className="w-8 h-8 rounded-lg bg-accent-cursed/15 border border-accent-cursed/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={16} className="text-accent-hollow" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 border",
                msg.role === "user"
                  ? "bg-accent-chakra/15 border-accent-chakra/25 text-foreground"
                  : "bg-surface border-accent-cursed/15 text-foreground-secondary"
              )}
            >
              {msg.role === "user" ? (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="relative">
                  {msg.content ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    msg.isStreaming && (
                      <span className="inline-flex items-center gap-1 text-xs text-foreground-muted italic">
                        <span>Consulting the vault scrolls...</span>
                      </span>
                    )
                  )}

                  {/* Pulsing streaming cursor */}
                  {msg.isStreaming && msg.content && (
                    <span
                      aria-hidden="true"
                      className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-accent-hollow rounded-sm animate-pulse"
                    />
                  )}
                </div>
              )}

              {/* Matched Link Cards */}
              {msg.matchedLinks && msg.matchedLinks.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-accent-cursed/15 pt-3">
                  <div className="text-[11px] font-semibold text-accent-hollow uppercase tracking-wider mb-1">
                    Matched Scroll{msg.matchedLinks.length > 1 ? "s" : ""}:
                  </div>
                  {msg.matchedLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-background-secondary border border-border-custom hover:border-accent-cursed/50 hover:bg-surface-hover transition-all group"
                    >
                      {link.faviconUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={link.faviconUrl}
                          alt=""
                          className="w-5 h-5 rounded shrink-0 object-contain"
                        />
                      ) : (
                        <ExternalLink
                          size={16}
                          className="text-foreground-muted shrink-0"
                        />
                      )}
                      <span className="text-sm text-foreground flex-1 truncate group-hover:text-accent-rasengan transition-colors">
                        {link.title || link.url}
                      </span>
                      <ExternalLink
                        size={14}
                        className="text-foreground-muted shrink-0 group-hover:text-accent-rasengan transition-colors"
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

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-border-custom bg-background-secondary/30"
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
          {loading ? (
            <button
              type="button"
              onClick={handleStop}
              className="btn-secondary px-3.5 py-2 text-accent-primary border-accent-primary/40 hover:bg-accent-primary/10 flex items-center gap-1.5 font-medium text-xs transition-colors rounded-xl"
              title="Stop generating"
            >
              <Square size={13} className="fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
              title="Send message"
            >
              <Send size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
