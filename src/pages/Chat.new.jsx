import { Bot, CornerDownLeft, Sparkles, User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { sendChatMessage } from "../api/chatApi";

const starterPrompts = [
  "Make a study plan for this week",
  "Help me organize my pending tasks",
  "How should I start a difficult project?",
];

const initialMessage = {
  id: 1,
  role: "assistant",
  text: "Hi, I am your smart productivity assistant. Ask me to break down work, plan your day, or turn ideas into clear next steps.",
  source: "system",
};

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submitMessage = async (rawMessage) => {
    const trimmedMessage = rawMessage.trim();
    if (!trimmedMessage || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmedMessage,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await sendChatMessage(trimmedMessage);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: data.reply,
          source: data.source,
        },
      ]);
    } catch (requestError) {
      setError(requestError.message || "Unable to send message.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitMessage(message);
  };

  return (
    <section className="min-h-[calc(100vh-7rem)] rounded-[2rem] bg-slate-950 text-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.35)] ring-1 ring-white/10">
      <div className="grid min-h-[calc(100vh-7rem)] grid-cols-1 overflow-hidden rounded-[2rem] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-700 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.25),transparent_25%)]" />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur">
              <Sparkles size={14} />
              AI Chat Assistant
            </div>

            <div className="space-y-3">
              <h1 className="max-w-xs text-3xl font-semibold leading-tight sm:text-4xl">
                Complete your work with faster, smarter replies.
              </h1>
              <p className="max-w-sm text-sm leading-6 text-blue-50/90 sm:text-base">
                Use the chatbot to brainstorm, break down tasks, and get clear next steps without leaving your dashboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitMessage(prompt)}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 text-left text-sm text-white/95 transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex min-h-[32rem] flex-col bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_28%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-medium text-slate-200">Live conversation</p>
              <p className="text-xs text-slate-400">
                {loading ? "Generating a reply..." : "Chatbot is ready"}
              </p>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Online
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.map((item) => {
              const isAssistant = item.role === "assistant";

              return (
                <div
                  key={item.id}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-lg sm:max-w-[75%] ${
                      isAssistant
                        ? "rounded-bl-md border border-white/10 bg-white/8 text-slate-100 backdrop-blur"
                        : "rounded-br-md bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-inherit/80">
                      {isAssistant ? <Bot size={14} /> : <User2 size={14} />}
                      {isAssistant ? "Assistant" : "You"}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 sm:text-[15px]">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-3xl rounded-bl-md border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                    <Bot size={14} />
                    Assistant
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.3s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.15s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300" />
                  </div>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4 sm:p-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-2 shadow-[0_20px_45px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label htmlFor="chat-message" className="mb-2 block px-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Your message
                  </label>
                  <textarea
                    id="chat-message"
                    rows={3}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmit(event);
                      }
                    }}
                    placeholder="Ask for a study plan, project roadmap, or help prioritizing tasks..."
                    className="min-h-[96px] w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[160px]"
                >
                  <CornerDownLeft size={18} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
