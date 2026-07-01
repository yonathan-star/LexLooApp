"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGate } from "../../components/AdminGate";
import { PageHeader, Table } from "../../components/ui";
import { apiRequest } from "../../lib/api";

interface QaIssue {
  wordId: string;
  text: string;
  status: string;
  problems: string[];
}

// Screen 75: Admin Content QA — surfaces draft words missing required
// fields so a bad tile experience never reaches a published pack.
export default function QaPage() {
  const [issues, setIssues] = useState<QaIssue[]>([]);

  useEffect(() => {
    apiRequest<QaIssue[]>("/words/qa/issues").then(setIssues).catch(() => undefined);
  }, []);

  return (
    <AdminGate>
      <PageHeader title="Content QA" />
      {!issues.length ? (
        <p className="text-textSecondary">No outstanding issues. Drafts and published words pass the current QA rules.</p>
      ) : (
        <Table headers={["Word", "Status", "Issues", ""]}>
          {issues.map((issue) => (
            <tr key={issue.wordId}>
              <td className="px-4 py-3 text-textPrimary font-medium">{issue.text}</td>
              <td className="px-4 py-3 text-textSecondary">{issue.status}</td>
              <td className="px-4 py-3 text-danger text-sm">{issue.problems.join(", ")}</td>
              <td className="px-4 py-3">
                <Link href={`/words/${issue.wordId}`} className="text-primary text-sm font-semibold">
                  Fix
                </Link>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </AdminGate>
  );
}
