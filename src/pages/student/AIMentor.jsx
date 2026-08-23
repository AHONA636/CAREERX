import { Sparkles } from 'lucide-react';
import AIChat from '../../components/chat/AIChat';

export default function AIMentor() {
  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col lg:h-[calc(100vh-6rem)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
          <Sparkles size={20} />
        </span>
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900">CareerX AI Mentor</h1>
          <p className="text-navy-500">Your personal career intelligence assistant.</p>
        </div>
      </div>
      <div className="card-surface min-h-0 flex-1 rounded-2xl p-5 sm:p-6">
        <AIChat />
      </div>
    </div>
  );
}
