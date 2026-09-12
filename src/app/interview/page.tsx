"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { generateAIResponse, evaluateSession, type ChatMessage, type InterviewSession } from "@/lib/interview-data";

const ROLES = [
  { name: "Software Engineer", emoji: "💻" },
  { name: "Product Manager", emoji: "📋" },
  { name: "Data Scientist", emoji: "📊" },
  { name: "UX Designer", emoji: "🎨" },
  { name: "DevOps Engineer", emoji: "🔧" },
  { name: "Marketing Lead", emoji: "📈" },
];

export default function InterviewPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"voice" | "text">("text");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSupported: ttsSupported } = useSpeechSynthesis();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (transcript.trim()) {
      setInputText((prev) => (prev ? prev + " " + transcript : transcript));
    }
  }, [transcript]);

  const startInterview = (role: string) => {
    setSelectedRole(role);
    const greeting: ChatMessage = {
      id: crypto.randomUUID(),
      role: "ai",
      content: generateAIResponse([], role),
      timestamp: Date.now(),
    };
    setMessages([greeting]);
    if (ttsSupported) {
      setTimeout(() => speak(greeting.content), 500);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    resetTranscript();
    setIsAiTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const aiResponse = generateAIResponse([...messages, userMessage], selectedRole!);
    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "ai",
      content: aiResponse,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsAiTyping(false);

    if (ttsSupported) {
      speak(aiResponse);
    }

    if (messages.length >= 16) {
      const evaluation = evaluateSession([...messages, userMessage, aiMessage]);
      const session: InterviewSession = {
        id: sessionId,
        role: selectedRole!,
        date: new Date().toISOString(),
        messages: [...messages, userMessage, aiMessage],
        evaluation,
      };

      const existing = JSON.parse(localStorage.getItem("interview-history") || "[]");
      existing.push(session);
      localStorage.setItem("interview-history", JSON.stringify(existing));

      setTimeout(() => setIsInterviewComplete(true), 1500);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedRole) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent p-4 text-white mb-6 shadow-xl shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Start Your Interview</h1>
          <p className="text-muted max-w-md mx-auto">Choose a role to begin practicing. The AI will ask you relevant questions and provide real-time feedback.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
          {ROLES.map((role) => (
            <button
              key={role.name}
              onClick={() => startInterview(role.name)}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-6 text-left transition-all hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 active:scale-[0.98]"
            >
              <span className="text-3xl">{role.emoji}</span>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{role.name}</h3>
                <p className="text-xs text-muted mt-1">8 questions</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isInterviewComplete) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-success/10 p-6 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-success">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Interview Complete!</h1>
          <p className="text-muted mb-8 max-w-md">Great job finishing your interview. View your detailed evaluation to see where you excelled and where to improve.</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => router.push(`/evaluator?session=${sessionId}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              View Evaluation
            </button>
            <button
              onClick={() => {
                setSelectedRole(null);
                setMessages([]);
                setIsInterviewComplete(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-8 py-3.5 text-sm font-semibold transition-all hover:bg-surface-alt hover:scale-[1.02]"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
      {/* Interview Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M4.75 3a1.75 1.75 0 0 0-1.75 1.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 10 8.25v-3.5A1.75 1.75 0 0 0 8.25 3h-3.5ZM4.75 9A3.25 3.25 0 0 0 1.5 12.25v3.5A3.25 3.25 0 0 0 4.75 19h3.5A3.25 3.25 0 0 0 11.5 15.75v-3.5A3.25 3.25 0 0 0 8.25 9h-3.5ZM13.25 3a1.75 1.75 0 0 0-1.75 1.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 20.25 8.25v-3.5A1.75 1.75 0 0 0 18.5 3h-3.5ZM13.25 9A3.25 3.25 0 0 0 10 12.25v3.5A3.25 3.25 0 0 0 13.25 19h3.5A3.25 3.25 0 0 0 20 15.75v-3.5A3.25 3.25 0 0 0 16.75 9h-3.5ZM4.75 15a1.75 1.75 0 0 0-1.75 1.75v.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 10 17.75v-.5A1.75 1.75 0 0 0 8.25 15h-3.5ZM13.25 15a1.75 1.75 0 0 0-1.75 1.75v.5c0 .966.784 1.75 1.75 1.75h3.5a1.75 1.75 0 0 0 1.75-1.75v-.5A1.75 1.75 0 0 0 16.75 15h-3.5Z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold">{selectedRole} Interview</h2>
            <p className="text-xs text-muted">Question {Math.min(messages.filter(m => m.role === "ai").length, 8)} of 8</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInputMode("text")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              inputMode === "text" ? "bg-primary text-white" : "bg-surface-alt text-muted hover:text-foreground"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setInputMode("voice")}
            disabled={!isSupported}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              inputMode === "voice" ? "bg-primary text-white" : "bg-surface-alt text-muted hover:text-foreground"
            } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Voice {isSupported ? "" : "(N/A)"}
          </button>
          <button
            onClick={() => stopSpeaking()}
            className="rounded-lg bg-surface-alt p-1.5 text-muted hover:text-foreground transition-colors"
            title="Stop AI speech"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 mb-4 px-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                msg.role === "ai"
                  ? "bg-surface border border-border rounded-bl-sm shadow-sm"
                  : "bg-gradient-to-br from-primary to-primary-dark text-white rounded-br-sm shadow-lg shadow-primary/15"
              }`}
            >
              {msg.role === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-muted">AI Interviewer</span>
                </div>
              )}
              <p className={`text-sm leading-relaxed ${msg.role === "ai" ? "text-foreground" : ""}`}>{msg.content}</p>
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-muted">Thinking...</span>
              </div>
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border pt-4">
        {inputMode === "voice" && isSupported ? (
          <div className="flex flex-col items-center gap-4 py-4">
            {isListening && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <div className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                </div>
                Listening...
              </div>
            )}
            {inputText && (
              <div className="w-full max-w-xl rounded-xl bg-surface-alt p-4 text-sm">
                <p className="text-muted text-xs mb-1">Your response:</p>
                <p className="text-foreground">{inputText}</p>
              </div>
            )}
            <button
              onClick={handleVoiceToggle}
              className={`relative rounded-full p-6 transition-all ${
                isListening
                  ? "bg-danger text-white shadow-lg shadow-danger/30 scale-110"
                  : "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105"
              }`}
            >
              {isListening && <span className="absolute inset-0 rounded-full animate-pulse-ring bg-danger/30" />}
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10">
                  <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              )}
            </button>
            <p className="text-xs text-muted">
              {isListening ? "Click to stop recording" : "Click to start speaking"}
            </p>
            {inputText.trim() && (
              <button
                onClick={sendMessage}
                disabled={isAiTyping}
                className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50"
              >
                Send Response
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isAiTyping}
              className="rounded-xl bg-gradient-to-r from-primary to-primary-dark p-3 text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.05] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
