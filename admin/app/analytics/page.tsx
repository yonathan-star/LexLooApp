"use client";

import { useEffect, useState } from "react";
import { AdminGate } from "../../components/AdminGate";
import { PageHeader, Card, StatCard, Table } from "../../components/ui";
import { apiRequest } from "../../lib/api";

interface AnalyticsData {
  kpis: {
    activeLearners: number;
    firstScans: number;
    sevenDayStreaks: number;
    completedWords: number;
    invalidScans: number;
    practiceSessions: number;
    scanToPracticeRate: number;
  };
  eventCounts: { eventName: string; count: number }[];
  scansByDay: { date: string; count: number }[];
}

// Screen 73: Admin Analytics — learning and scan metrics with basic charts
// (rendered as simple bars rather than pulling in a charting library for MVP).
export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    apiRequest<AnalyticsData>("/admin/analytics").then(setData).catch(() => undefined);
  }, []);

  const maxScans = Math.max(1, ...(data?.scansByDay.map((d) => d.count) ?? [1]));

  return (
    <AdminGate>
      <PageHeader title="Analytics" />

      {data ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Active learners" value={data.kpis.activeLearners} />
          <StatCard label="First scans" value={data.kpis.firstScans} />
          <StatCard label="7-day streaks" value={data.kpis.sevenDayStreaks} />
          <StatCard label="Words completed" value={data.kpis.completedWords} />
          <StatCard label="Invalid scans" value={data.kpis.invalidScans} />
          <StatCard label="Practice sessions" value={data.kpis.practiceSessions} />
          <StatCard label="Scan to practice" value={`${data.kpis.scanToPracticeRate}%`} />
        </div>
      ) : null}

      <Card className="mb-6">
        <h2 className="text-textPrimary font-bold mb-3">Scans (last 30 days)</h2>
        <div className="flex items-end gap-1 h-32">
          {(data?.scansByDay ?? []).map((d) => (
            <div key={d.date} className="flex-1 bg-primary rounded-t" style={{ height: `${(d.count / maxScans) * 100}%` }} title={`${d.date}: ${d.count}`} />
          ))}
        </div>
      </Card>

      <Table headers={["Event", "Count (30 days)"]}>
        {(data?.eventCounts ?? []).map((e) => (
          <tr key={e.eventName}>
            <td className="px-4 py-3 text-textPrimary">{e.eventName}</td>
            <td className="px-4 py-3 text-textSecondary">{e.count}</td>
          </tr>
        ))}
      </Table>
    </AdminGate>
  );
}
