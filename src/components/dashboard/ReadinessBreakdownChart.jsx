import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-navy-800">{p.label}</p>
      <p className="text-navy-500">{p.value}% current</p>
    </div>
  );
}

export default function ReadinessBreakdownChart({ data }) {
  return (
    <div style={{ width: '100%', height: data.length * 44 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 0 }} barCategoryGap={14}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="label"
            width={140}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-navy-500)', fontSize: 12.5, fontWeight: 500 }}
          />
          <Tooltip cursor={{ fill: 'var(--color-surface-100)' }} content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[6, 6, 6, 6]} maxBarSize={16}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
            <LabelList dataKey="value" position="right" formatter={(v) => `${v}%`} style={{ fill: 'var(--color-navy-700)', fontSize: 12, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
