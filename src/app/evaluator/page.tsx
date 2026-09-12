"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { type InterviewSession, type EvaluationResult, evaluateSession } from "@/lib/interview-data";

function ScoreRing({ score, size = 120, strokeWidth = 8 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--border)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-muted">out of 100</span>
      </div>
    </div>
  );
}

function ScoreBar({ name, score, feedback }: { name: string; score: number; feedback: string }) {
  const color = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-danger";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm font-bold" style={{ color: score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)" }}>
          {score}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-surface-alt overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700 ease-out`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-muted leading-relaxed">{feedback}</p>
    </div>
  );
}

export default function EvaluatorPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState("");

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("interview-history") || "[]") as InterviewSession[];
    setSessions(history);

    if (sessionId) {
      const session = history.find((s) => s.id === sessionId);
      if (session) {
        setSelectedSession(session);
        if (session.evaluation) {
          setEvaluation(session.evaluation);
        } else {
          const evalResult = evaluateSession(session.messages);
          setEvaluation(evalResult);
          session.evaluation = evalResult;
          localStorage.setItem("interview-history", JSON.stringify(history));
        }
      }
    }
  }, [sessionId]);

  const handlePasteEvaluate = () => {
    if (!pastedText.trim()) return;

    const messages = pastedText.split("\n").filter(Boolean).map((line, i) => ({
      id: crypto.randomUUID(),
      role: (i % 2 === 0 ? "ai" : "user") as "ai" | "user",
      content: line.replace(/^(Interviewer|Candidate|AI|You):\s*/i, ""),
      timestamp: Date.now() + i,
    }));

    const evalResult = evaluateSession(messages);
    setEvaluation(evalResult);
    setPasteMode(false);
  };

  return (
    <div className="flex-1 mx-auto max-w-4xl w-full px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Interview Evaluator</h1>
        <p className="text-muted">Get detailed feedback on your interview performance</p>
      </div>

      {!evaluation && !pasteMode && (
        <div className="space-y-6">
          {sessions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
              <div className="grid gap-3">
                {sessions.slice().reverse().map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      setSelectedSession(session);
                      if (session.evaluation) {
                        setEvaluation(session.evaluation);
                      } else {
                        const evalResult = evaluateSession(session.messages);
                        setEvaluation(evalResult);
                        session.evaluation = evalResult;
                        const updated = sessions.map(s => s.id === session.id ? session : s);
                        localStorage.setItem("interview-history", JSON.stringify(updated));
                      }
                    }}
                    className="w-full flex items-center justify-between rounded-xl border border-border bg-surface p-4 text-left transition-all hover:shadow-md hover:border-primary/30"
                  >
                    <div>
                      <h3 className="font-medium">{session.role}</h3>
                      <p className="text-xs text-muted mt-1">{new Date(session.date).toLocaleDateString()} &middot; {session.messages.length} messages</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-muted">
                      <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted">or</span>
            </div>
          </div>

          <button
            onClick={() => setPasteMode(true)}
            className="w-full rounded-xl border-2 border-dashed border-border p-8 text-center transition-all hover:border-primary/30 hover:bg-primary/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-muted mx-auto mb-3">
              <path d="M7.5 3.75A1.75 1.75 0 005.75 5.5v13A1.75 1.75 0 007.5 20.25h9A1.75 1.75 0 0018.25 18.5V5.5A1.75 1.75 0 0016.5 3.75h-9zM6 5.5a1.5 1.5 0 011.5-1.5h9A1.5 1.5 0 0118 5.5v13a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 18.5v-13z" />
            </svg>
            <h3 className="font-semibold mb-1">Paste Interview Transcript</h3>
            <p className="text-sm text-muted">Evaluate an interview by pasting the conversation</p>
          </button>
        </div>
      )}

      {pasteMode && !evaluation && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-semibold mb-3">Paste Your Transcript</h2>
            <p className="text-xs text-muted mb-3">Paste the interview conversation. Lines alternate between interviewer and candidate.</p>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={12}
              placeholder={"Interviewer: Tell me about yourself.\nCandidate: I am a software engineer with 5 years of experience...\nInterviewer: What are your strengths?\nCandidate: My strengths include..."}
              className="w-full resize-none rounded-lg border border-border bg-surface-alt px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePasteEvaluate}
              disabled={!pastedText.trim()}
              className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50"
            >
              Evaluate Transcript
            </button>
            <button
              onClick={() => setPasteMode(false)}
              className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium transition-all hover:bg-surface-alt"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {evaluation && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setEvaluation(null); setSelectedSession(null); setPasteMode(false); }}
              className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
              </svg>
              Back to Evaluator
            </button>
            {selectedSession && (
              <span className="text-xs text-muted">{selectedSession.role} &middot; {new Date(selectedSession.date).toLocaleDateString()}</span>
            )}
          </div>

          {/* Overall Score */}
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <h2 className="text-lg font-semibold mb-6">Overall Score</h2>
            <div className="flex justify-center mb-6">
              <ScoreRing score={evaluation.overallScore} size={140} strokeWidth={10} />
            </div>
            <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">{evaluation.summary}</p>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h2 className="text-lg font-semibold mb-6">Detailed Breakdown</h2>
            <div className="space-y-6">
              {evaluation.categories.map((cat, i) => (
                <ScoreBar key={i} name={cat.name} score={cat.score} feedback={cat.feedback} />
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-success/30 bg-success/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-success">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-warning">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.004zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-warning">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2">
                {evaluation.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transcript */}
          {selectedSession && (
            <div className="rounded-2xl border border-border bg-surface p-8">
              <h2 className="text-lg font-semibold mb-6">Full Transcript</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
                {selectedSession.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                      msg.role === "ai"
                        ? "bg-surface-alt border border-border"
                        : "bg-primary/10 border border-primary/20"
                    }`}>
                      <p className="text-xs font-medium text-muted mb-1">{msg.role === "ai" ? "AI Interviewer" : "You"}</p>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
