"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGate } from "../../components/AdminGate";
import { PageHeader, Table, Button } from "../../components/ui";
import { apiRequest } from "../../lib/api";

interface WordRow {
  id: string;
  text: string;
  status: string;
  difficultyScore: number;
  language: { name: string };
  content?: { shortDefinition: string } | null;
}

// Screen 66: Admin Word List — search/filter words; "Add Word" routes to
// the editor (Screen 67) with no code deploy required to publish content.
export default function WordsPage() {
  const [words, setWords] = useState<WordRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiRequest<WordRow[]>(`/words?search=${encodeURIComponent(search)}`).then(setWords).catch(() => undefined);
  }, [search]);

  return (
    <AdminGate>
      <PageHeader
        title="Words"
        action={
          <Link href="/words/new">
            <Button>Add Word</Button>
          </Link>
        }
      />
      <input
        className="w-full max-w-sm mb-4"
        placeholder="Search words..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table headers={["Word", "Language", "Difficulty", "Status", ""]}>
        {words.map((w) => (
          <tr key={w.id}>
            <td className="px-4 py-3 text-textPrimary font-medium">{w.text}</td>
            <td className="px-4 py-3 text-textSecondary">{w.language?.name}</td>
            <td className="px-4 py-3 text-textSecondary">{w.difficultyScore}</td>
            <td className="px-4 py-3">
              <span className={`text-xs px-2 py-1 rounded-full ${w.status === "published" ? "bg-success/20 text-success" : "bg-cardAlt text-textMuted"}`}>
                {w.status}
              </span>
            </td>
            <td className="px-4 py-3">
              <Link href={`/words/${w.id}`} className="text-primary text-sm font-semibold">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </AdminGate>
  );
}
