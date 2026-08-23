import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import RoleShell from '../../components/layout/RoleShell';
import { educatorNavItems } from './educatorNav';
import ChartCard from '../../components/ui/ChartCard';
import AIInsight from '../../components/ui/AIInsight';
import { cohortSkillGaps } from '../../data/educatorAdminMockData';

export default function SkillGapInsights() {
  return (
    <RoleShell roleLabel="Educator" navItems={educatorNavItems}>
      <div className="space-y-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-navy-900 sm:text-3xl">Skill Gap Insights</h1>
          <p className="mt-1 text-navy-500">The most common skill gaps across your entire cohort.</p>
        </div>

        <ChartCard title="Average Gap by Skill" subtitle="Gap = required proficiency − average current proficiency">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={cohortSkillGaps} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 0 }}>
                <CartesianGrid horizontal={false} stroke="var(--color-surface-200)" />
                <XAxis type="number" tick={{ fill: 'var(--color-navy-400)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="skill" width={140} tick={{ fill: 'var(--color-navy-600)', fontSize: 12.5, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-surface-200)', fontSize: 12.5 }} />
                <Bar dataKey="avgGap" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  {cohortSkillGaps.map((d) => (
                    <Cell key={d.skill} fill={d.avgGap > 25 ? 'var(--color-rose-500)' : 'var(--color-amber-500)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <AIInsight className="mt-5">
            System Design has the widest cohort-wide gap — consider scheduling a dedicated workshop before the next placement cycle.
          </AIInsight>
        </ChartCard>
      </div>
    </RoleShell>
  );
}
