import { useMemo, useState } from 'react';
import { ClipboardList, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { UpcomingAssessmentCard, CompletedAssessmentCard } from '../../components/assessment/AssessmentCard';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import ProgressRing from '../../components/ui/ProgressRing';
import { useApp } from '../../context/AppContext';

const mockQuestions = [
  { q: 'Which data structure gives O(1) average lookup time?', options: ['Linked List', 'Hash Map', 'Array', 'Binary Tree'], correct: 1 },
  { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correct: 1 },
  { q: 'Which traversal visits the root node first?', options: ['In-order', 'Post-order', 'Pre-order', 'Level-order'], correct: 2 },
];

export default function Assessments() {
  const { assessmentState, completeAssessment } = useApp();
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const avgScore = useMemo(() => {
    const scores = assessmentState.completed.map((a) => a.score);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }, [assessmentState.completed]);

  function openAssessment(a) {
    setActiveAssessment(a);
    setAnswers({});
    setSubmitted(false);
  }

  function submit() {
    const correctCount = mockQuestions.filter((q, i) => answers[i] === q.correct).length;
    const pct = Math.round((correctCount / mockQuestions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    completeAssessment(activeAssessment.id, pct || 65);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Assessments</h1>
        <p className="mt-1 text-navy-500">Verify your skills and track improvement through adaptive assessments.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ClipboardList} tone="navy" label="Upcoming" value={assessmentState.upcoming.length} delay={0.02} />
        <StatCard icon={CheckCircle2} tone="emerald" label="Completed" value={assessmentState.completed.length} delay={0.06} />
        <StatCard icon={Award} tone="amber" label="Average Score" value={`${avgScore}%`} delay={0.1} />
        <StatCard icon={TrendingUp} tone="violet" label="Skill Improvement" value="+18%" sublabel="Last 30 days" delay={0.14} />
      </div>

      <section>
        <h2 className="mb-4 font-[var(--font-display)] text-lg font-semibold text-navy-900">Upcoming Assessments</h2>
        {assessmentState.upcoming.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {assessmentState.upcoming.map((a, i) => (
              <UpcomingAssessmentCard key={a.id} assessment={a} onStart={openAssessment} delay={i * 0.06} />
            ))}
          </div>
        ) : (
          <div className="card-surface rounded-2xl p-8 text-center text-sm text-navy-400">
            No upcoming assessments — you're all caught up. Check back after your next roadmap update.
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-[var(--font-display)] text-lg font-semibold text-navy-900">Completed Assessments</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {assessmentState.completed.map((a, i) => (
            <CompletedAssessmentCard key={a.id} assessment={a} delay={i * 0.06} />
          ))}
        </div>
      </section>

      <Modal
        open={!!activeAssessment}
        onClose={() => setActiveAssessment(null)}
        title={submitted ? 'Assessment Results' : activeAssessment?.title}
        size="md"
      >
        {activeAssessment && !submitted ? (
          <div className="space-y-6">
            {mockQuestions.map((q, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-navy-800">{i + 1}. {q.q}</p>
                <div className="mt-2.5 space-y-2">
                  {q.options.map((opt, oi) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                        answers[i] === oi ? 'border-navy-800 bg-navy-50 text-navy-900' : 'border-surface-200 text-navy-600 hover:border-navy-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        className="accent-navy-900"
                        checked={answers[i] === oi}
                        onChange={() => setAnswers((prev) => ({ ...prev, [i]: oi }))}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button className="w-full justify-center" onClick={submit} disabled={Object.keys(answers).length < mockQuestions.length}>
              Submit Assessment
            </Button>
          </div>
        ) : null}

        {submitted ? (
          <div className="flex flex-col items-center py-4 text-center">
            <ProgressRing value={score} size={120} strokeWidth={9} label="Score" />
            <h3 className="mt-5 font-[var(--font-display)] text-lg font-bold text-navy-900">
              {score >= 70 ? 'Great work!' : 'Good attempt — keep practicing.'}
            </h3>
            <p className="mt-1.5 max-w-xs text-sm text-navy-500">
              Your readiness score has been updated. This assessment has moved to your completed list.
            </p>
            <Button className="mt-6 w-full justify-center" onClick={() => setActiveAssessment(null)}>Done</Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
