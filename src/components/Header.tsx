import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white text-lg font-bold shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M4.75 3a1.75 1.75 0 0 0-1.75 1.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 10 8.25v-3.5A1.75 1.75 0 0 0 8.25 3h-3.5ZM4.75 9A3.25 3.25 0 0 0 1.5 12.25v3.5A3.25 3.25 0 0 0 4.75 19h3.5A3.25 3.25 0 0 0 11.5 15.75v-3.5A3.25 3.25 0 0 0 8.25 9h-3.5ZM13.25 3a1.75 1.75 0 0 0-1.75 1.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 20.25 8.25v-3.5A1.75 1.75 0 0 0 18.5 3h-3.5ZM13.25 9A3.25 3.25 0 0 0 10 12.25v3.5A3.25 3.25 0 0 0 13.25 19h3.5A3.25 3.25 0 0 0 20 15.75v-3.5A3.25 3.25 0 0 0 16.75 9h-3.5ZM4.75 15a1.75 1.75 0 0 0-1.75 1.75v.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 10 17.75v-.5A1.75 1.75 0 0 0 8.25 15h-3.5ZM13.25 15a1.75 1.75 0 0 0-1.75 1.75v.5c0 .966.784 1.75 1.75 1.75h3.5a1.75 1.75 0 0 0 1.75-1.75v-.5A1.75 1.75 0 0 0 16.75 15h-3.5Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">AI Interviewer</h1>
              <p className="text-[10px] text-muted -mt-1 tracking-wider uppercase">Multimodal Practice</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/interview"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
            >
              Start Interview
            </Link>
            <Link
              href="/evaluator"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent/10 hover:text-accent"
            >
              Evaluate
            </Link>
            <Link
              href="/history"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
            >
              History
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
