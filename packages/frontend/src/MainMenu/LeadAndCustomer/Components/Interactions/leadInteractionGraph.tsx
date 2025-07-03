import { Lead } from "shared-types";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const LeadInteractionGraph = ({ lead, onBack }: { lead: Lead; onBack: () => void }) => {
  return (
    <div className="bg-blue-50 mt-2 p-4 rounded-lg border border-blue-200">
      <div className="flex justify-end mb-2">
        <Button onClick={onBack}>← חזור לפרטים</Button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lead.interactions.map(i => ({
          date: new Date(i.date).toLocaleDateString(),
          count: 1
        }))}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
