"use client";

import Link from "next/link";

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
      </svg>
    ),
    title: "Voice Interaction",
    description: "Speak naturally and get AI responses through speech synthesis. Feel like a real interview.",
    color: "from-primary to-primary-dark",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
      </svg>
    ),
    title: "Text Chat Mode",
    description: "Prefer typing? Use the text-based interface for a more traditional interview experience.",
    color: "from-accent to-cyan-600",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
    title: "Smart Evaluation",
    description: "Get detailed scoring on communication, technical knowledge, problem-solving, and more.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Performance Tracking",
    description: "Track your progress over time with detailed history and trend analysis.",
    color: "from-amber-500 to-orange-600",
  },
];

const roles = [
  { name: "Software Engineer", emoji: "💻", difficulty: "Intermediate" },
  { name: "Product Manager", emoji: "📋", difficulty: "Advanced" },
  { name: "Data Scientist", emoji: "📊", difficulty: "Intermediate" },
  { name: "UX Designer", emoji: "🎨", difficulty: "Beginner" },
  { name: "DevOps Engineer", emoji: "🔧", difficulty: "Advanced" },
  { name: "Marketing Lead", emoji: "📈", difficulty: "Beginner" },
];

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            AI-Powered Interview Practice
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Ace Your Next
            <br />
            <span className="text-gradient">Interview</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            Practice with our AI interviewer using voice or text. Get instant, detailed feedback
            on your performance across multiple dimensions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Start Interview
            </Link>
            <Link
              href="/evaluator"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-surface-alt hover:scale-[1.02]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              Evaluate Session
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
          <p className="mt-4 text-lg text-muted">Everything you need to prepare for your next interview</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border bg-surface p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white mb-4 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role Selection Preview */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 bg-surface-alt/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Choose Your Role</h2>
          <p className="mt-4 text-lg text-muted">Practice for any position with role-specific questions</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {roles.map((role, i) => (
            <Link
              key={i}
              href="/interview"
              className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
            >
              <span className="text-3xl">{role.emoji}</span>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{role.name}</h3>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                  role.difficulty === "Beginner"
                    ? "bg-emerald-100 text-emerald-700"
                    : role.difficulty === "Intermediate"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {role.difficulty}
                </span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-muted group-hover:text-primary transition-colors">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted">
          <p>Built with Next.js, Web Speech API, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
