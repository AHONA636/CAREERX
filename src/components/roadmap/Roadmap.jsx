import { useState } from 'react';
import RoadmapStep from './RoadmapStep';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function Roadmap({ steps }) {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div>
      <div className="mt-2">
        {steps.map((step, i) => (
          <RoadmapStep
            key={step.id}
            step={step}
            index={i}
            isLast={i === steps.length - 1}
            onOpen={setActiveStep}
            delay={i * 0.06}
          />
        ))}
      </div>

      <Modal open={!!activeStep} onClose={() => setActiveStep(null)} title={activeStep?.title} size="sm">
        {activeStep ? (
          <div className="space-y-4">
            <Badge tone={activeStep.status === 'completed' ? 'success' : activeStep.status === 'in-progress' ? 'warning' : 'neutral'}>
              {activeStep.status === 'completed' ? 'Completed' : activeStep.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
            </Badge>
            <p className="text-sm leading-relaxed text-navy-600">{activeStep.description}</p>
            {activeStep.status === 'completed' ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
                <CheckCircle2 size={16} /> This milestone is complete and counted toward your readiness score.
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-xl bg-violet-50 px-3 py-2.5 text-sm text-violet-700">
                <Sparkles size={16} className="mt-0.5 shrink-0" />
                CareerX will notify you as soon as this milestone becomes actionable, based on your current pace.
              </div>
            )}
          </div>
        ) : null}
        <div className="mt-5 flex justify-end">
          <Button size="sm" onClick={() => setActiveStep(null)}>Got it</Button>
        </div>
      </Modal>
    </div>
  );
}
