"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type InterviewSession } from "@/lib/interview-data";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("interview-history") || "[]") as InterviewSession[];
    setSessions(history);
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all interview history?")) {
      localStorage.removeItem("interview-history");
      setSessions([]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="flex-1 mx-auto max-w-4xl w-full px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Interview History</h1>
          <p className="text-muted mt-1">Track your progress over time</p>
        </div>
        {sessions.length > 0 && (
          <button
            onClick={clearHistory}
            className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
          >
            Clear History
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center rounded-full bg-surface-alt p-6 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-muted">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Interviews Yet</h2>
          <p className="text-muted mb-6">Start your first interview to see your history here.</p>
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            Start Interview
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-bold text-primary">{sessions.length}</p>
              <p className="text-xs text-muted mt-1">Total Interviews</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className={`text-2xl font-bold ${getScoreColor(Math.round(sessions.reduce((sum, s) => sum + (s.evaluation?.overallScore || 0), 0) / sessions.length))}`}>
                {Math.round(sessions.reduce((sum, s) => sum + (s.evaluation?.overallScore || 0), 0) / sessions.length)}
              </p>
              <p className="text-xs text-muted mt-1">Average Score</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-bold text-success">
                {Math.max(...sessions.map(s => s.evaluation?.overallScore || 0))}
              </p>
              <p className="text-xs text-muted mt-1">Best Score</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-bold text-accent">
                {new Set(sessions.map(s => s.role)).size}
              </p>
              <p className="text-xs text-muted mt-1">Roles Practiced</p>
            </div>
          </div>

          {/* Session List */}
          <div className="space-y-3">
            {sessions.slice().reverse().map((session) => (
              <Link
                key={session.id}
                href={`/evaluator?session=${session.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-xl">
                    {session.role === "Software Engineer" && "💻"}
                    {session.role === "Product Manager" && "📋"}
                    {session.role === "Data Scientist" && "📊"}
                    {session.role === "UX Designer" && "🎨"}
                    {session.role === "DevOps Engineer" && "🔧"}
                    {session.role === "Marketing Lead" && "📈"}
                  </div>
                  <div>
                    <h3 className="font-semibold">{session.role}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" "}&middot;{" "}{session.messages.length} messages
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {session.evaluation && (
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(session.evaluation.overallScore)}`}>
                        {session.evaluation.overallScore}
                      </p>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Score</p>
                    </div>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-muted">
                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
