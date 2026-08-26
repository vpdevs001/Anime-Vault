import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center mb-6 shadow-xl shadow-accent-primary/10">
        <Compass size={40} className="text-accent-primary animate-spin-slow" />
      </div>
      <h1 className="text-4xl font-bold font-[family-name:var(--font-rajdhani)] tracking-wider text-foreground mb-2">
        404 — Lost in the Domain
      </h1>
      <p className="text-foreground-secondary text-sm max-w-md mb-8">
        The scroll or folder you seek cannot be found in the Vault records. It may have been sealed or moved.
      </p>
      <Link
        href="/"
        className="btn-primary inline-flex items-center gap-2 px-6 py-3"
      >
        <ArrowLeft size={16} />
        Return to Dashboard
      </Link>
    </div>
  );
}
