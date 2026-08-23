import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function SkillGapRadar({ data }) {
  const chartData = data.map((d) => ({ skill: d.name, Current: d.current, Required: d.required }));

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <RadarChart data={chartData} outerRadius="72%">
          <PolarGrid stroke="var(--color-surface-300)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--color-navy-500)', fontSize: 11.5, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--color-navy-300)', fontSize: 10 }} />
          <Radar name="Required" dataKey="Required" stroke="var(--color-amber-500)" fill="var(--color-amber-500)" fillOpacity={0.12} strokeDasharray="4 3" />
          <Radar name="Current" dataKey="Current" stroke="var(--color-navy-700)" fill="var(--color-navy-700)" fillOpacity={0.22} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid var(--color-surface-200)', fontSize: 12.5 }}
          />
          <Legend wrapperStyle={{ fontSize: 12.5 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
