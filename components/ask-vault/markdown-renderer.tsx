"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  if (inline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded-md bg-background-tertiary text-accent-hollow font-mono text-[0.82em] border border-accent-cursed/20"
        {...props}
      >
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-2.5 rounded-xl overflow-hidden border border-accent-cursed/25 bg-background-secondary shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface-hover/80 border-b border-accent-cursed/15 text-[11px] text-foreground-muted font-mono select-none">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1 text-[11px] hover:text-foreground transition-colors p-1 rounded hover:bg-background-tertiary"
        >
          {copied ? (
            <>
              <Check size={12} className="text-accent-slayer" />
              <span className="text-accent-slayer">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs font-mono text-foreground leading-relaxed">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-content text-sm leading-relaxed text-foreground-secondary", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-foreground font-[family-name:var(--font-rajdhani)] tracking-wide mt-3 mb-1.5 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-foreground font-[family-name:var(--font-rajdhani)] tracking-wide mt-2.5 mb-1.5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-accent-hollow mt-2 mb-1 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-medium text-foreground mt-1.5 mb-1 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 text-foreground-secondary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 text-foreground-secondary">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent-cursed/60 pl-3 py-1 my-2 italic text-foreground-muted bg-accent-cursed/5 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-t border-accent-cursed/20 my-3" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-rasengan hover:underline inline-flex items-center gap-0.5 hover:text-accent-rasengan/80 font-medium"
            >
              <span>{children}</span>
              <ExternalLink size={12} className="inline shrink-0 ml-0.5 opacity-70" />
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2.5 rounded-lg border border-border-custom bg-background-secondary/50">
              <table className="min-w-full text-xs text-left divide-y divide-border-custom">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-hover/80 text-foreground font-semibold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border-custom/40">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-surface/50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-medium text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-foreground-secondary">{children}</td>
          ),
          code: CodeBlock as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
