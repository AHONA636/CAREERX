import ChartCard from '../../components/ui/ChartCard';
import Roadmap from '../../components/roadmap/Roadmap';
import DecisionLogic from '../../components/decision/DecisionLogic';
import AIInsight from '../../components/ui/AIInsight';
import { roadmapSteps, decisionLogicResult } from '../../data/mockData';

export default function RoadmapPage() {
  const completed = roadmapSteps.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Your Personalized Career Roadmap</h1>
        <p className="mt-1 text-navy-500">
          {completed} of {roadmapSteps.length} milestones completed · Understand → Verify → Identify Gap → Recommend → Assess → Track → Update
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <ChartCard title="Career Journey" subtitle="Tap any milestone for details" className="lg:col-span-3">
          <Roadmap steps={roadmapSteps} />
        </ChartCard>

        <div className="space-y-6 lg:col-span-2">
          <ChartCard title="Career Readiness Decision" subtitle="How CareerX decides your next recommendation">
            <DecisionLogic result={decisionLogicResult} />
          </ChartCard>
          <AIInsight>
            Completing "Close DSA Gap" is estimated to raise your readiness score by 9–12% within a month.
          </AIInsight>
        </div>
      </div>
    </div>
  );
}
