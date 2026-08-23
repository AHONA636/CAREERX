import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Bot } from 'lucide-react';
import { aiMentorQuickActions, aiMentorResponses, aiMentorSeedMessages } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

let msgId = aiMentorSeedMessages.length + 1;

function getResponse(text, readinessScore) {
  const key = text.trim().toLowerCase().replace(/[?.!]/g, '');
  const match = Object.keys(aiMentorResponses).find((k) => key.includes(k) || k.includes(key));
  if (match) return aiMentorResponses[match];
  return `That's a great question — based on your profile, I'd suggest focusing on DSA and System Design this week, since they carry the most weight toward your ${readinessScore}% readiness score. Want me to update your roadmap?`;
}

export default function AIChat() {
  const { user, careerGoal } = useApp();
  const [messages, setMessages] = useState(() => [
    { ...aiMentorSeedMessages[0], text: `Hi ${user.firstName}, I'm your CareerX AI Mentor. Based on your current progress, you're strongest in Python and React.` },
    ...aiMentorSeedMessages.slice(1).map((m) =>
      m.id === 'm_3' ? { ...m, text: `You are currently ${careerGoal.readinessScore}% ready for your target role: ${careerGoal.targetRole}.` } : m
    ),
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { id: ++msgId, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = { id: ++msgId, role: 'assistant', text: getResponse(trimmed, careerGoal.readinessScore) };
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 900 + Math.random() * 500);
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} aria-live="polite" className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {m.role === 'assistant' ? (
              <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
                <Bot size={13} strokeWidth={2.25} />
              </span>
            ) : null}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'rounded-br-sm bg-navy-900 text-white'
                  : 'rounded-bl-sm border border-violet-100 bg-violet-50/70 text-navy-700'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        {typing ? (
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
              <Bot size={13} strokeWidth={2.25} />
            </span>
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-violet-100 bg-violet-50/70 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-violet-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 border-t border-surface-100 pt-3">
        {aiMentorQuickActions.map((qa) => (
          <button
            key={qa}
            onClick={() => sendMessage(qa)}
            className="rounded-full border border-violet-100 bg-violet-50/60 px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
          >
            {qa}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Sparkles size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Mentor anything…"
            aria-label="Message the AI Mentor"
            className="w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-9 pr-3 text-sm text-navy-700 placeholder:text-navy-300 focus:border-navy-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-100"
          />
        </div>
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white transition-colors hover:bg-navy-800 disabled:opacity-40"
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
