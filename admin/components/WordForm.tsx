"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "./ui";
import { apiRequest } from "../lib/api";

interface Language {
  id: string;
  name: string;
}

interface WordFormValue {
  text: string;
  languageId: string;
  partOfSpeech: string;
  difficultyScore: number;
  gradeLevel: string;
  status: "draft" | "published";
  content: {
    shortDefinition: string;
    longDefinition: string;
    phonetic: string;
    origin: string;
    funFact: string;
    audioUrl: string;
  };
}

interface FetchedWord {
  text: string;
  languageId: string;
  partOfSpeech?: string | null;
  difficultyScore: number;
  gradeLevel?: string | null;
  status: "draft" | "published";
  content?: {
    shortDefinition?: string;
    longDefinition?: string;
    phonetic?: string;
    origin?: string;
    funFact?: string;
    audioUrl?: string;
  } | null;
}

const EMPTY: WordFormValue = {
  text: "",
  languageId: "",
  partOfSpeech: "",
  difficultyScore: 1,
  gradeLevel: "",
  status: "draft",
  content: { shortDefinition: "", longDefinition: "", phonetic: "", origin: "", funFact: "", audioUrl: "" },
};

// Screen 67: Admin Word Editor — create/edit the full word object model
// (definition, pronunciation, translations, examples). Validation required
// before publish; draft/published are kept as separate statuses.
export function WordForm({ wordId }: { wordId?: string }) {
  const router = useRouter();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [value, setValue] = useState<WordFormValue>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<Language[]>("/languages").then(setLanguages).catch(() => undefined);
    if (wordId) {
      apiRequest<FetchedWord>(`/words/${wordId}`).then((w) =>
        setValue({
          text: w.text,
          languageId: w.languageId,
          partOfSpeech: w.partOfSpeech ?? "",
          difficultyScore: w.difficultyScore,
          gradeLevel: w.gradeLevel ?? "",
          status: w.status,
          content: {
            shortDefinition: w.content?.shortDefinition ?? "",
            longDefinition: w.content?.longDefinition ?? "",
            phonetic: w.content?.phonetic ?? "",
            origin: w.content?.origin ?? "",
            funFact: w.content?.funFact ?? "",
            audioUrl: w.content?.audioUrl ?? "",
          },
        })
      );
    }
  }, [wordId]);

  function update<K extends keyof WordFormValue>(key: K, val: WordFormValue[K]) {
    setValue((v) => ({ ...v, [key]: val }));
  }

  function updateContent<K extends keyof WordFormValue["content"]>(key: K, val: string) {
    setValue((v) => ({ ...v, content: { ...v.content, [key]: val } }));
  }

  async function handleSave(publish: boolean) {
    setError(null);
    if (!value.text.trim() || !value.languageId || !value.content.shortDefinition.trim()) {
      setError("Word, language, and short definition are required before saving.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...value, status: publish ? "published" : "draft" };
      if (wordId) {
        await apiRequest(`/words/${wordId}`, { method: "PATCH", body: payload });
      } else {
        await apiRequest("/words", { method: "POST", body: payload });
      }
      router.push("/words");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save word");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="Word">
          <input value={value.text} onChange={(e) => update("text", e.target.value)} className="w-full" />
        </Field>
        <Field label="Language">
          <select value={value.languageId} onChange={(e) => update("languageId", e.target.value)} className="w-full">
            <option value="">Select...</option>
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Part of Speech">
          <input value={value.partOfSpeech} onChange={(e) => update("partOfSpeech", e.target.value)} className="w-full" />
        </Field>
        <Field label="Difficulty (1-10)">
          <input
            type="number"
            min={1}
            max={10}
            value={value.difficultyScore}
            onChange={(e) => update("difficultyScore", Number(e.target.value))}
            className="w-full"
          />
        </Field>
        <Field label="Grade Level">
          <input value={value.gradeLevel} onChange={(e) => update("gradeLevel", e.target.value)} className="w-full" />
        </Field>
      </div>

      <h3 className="text-textPrimary font-bold mt-2 mb-3">Content</h3>
      <Field label="Short Definition">
        <input value={value.content.shortDefinition} onChange={(e) => updateContent("shortDefinition", e.target.value)} className="w-full" />
      </Field>
      <Field label="Long Definition">
        <textarea value={value.content.longDefinition} onChange={(e) => updateContent("longDefinition", e.target.value)} className="w-full" rows={3} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phonetic">
          <input value={value.content.phonetic} onChange={(e) => updateContent("phonetic", e.target.value)} className="w-full" />
        </Field>
        <Field label="Audio URL">
          <input value={value.content.audioUrl} onChange={(e) => updateContent("audioUrl", e.target.value)} className="w-full" />
        </Field>
        <Field label="Origin">
          <input value={value.content.origin} onChange={(e) => updateContent("origin", e.target.value)} className="w-full" />
        </Field>
        <Field label="Fun Fact">
          <input value={value.content.funFact} onChange={(e) => updateContent("funFact", e.target.value)} className="w-full" />
        </Field>
      </div>

      {error ? <p className="text-danger text-sm mt-3">{error}</p> : null}

      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={() => handleSave(false)} disabled={saving}>
          Save Draft
        </Button>
        <Button onClick={() => handleSave(true)} disabled={saving}>
          Publish
        </Button>
      </div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-textSecondary block mb-1">{label}</label>
      {children}
    </div>
  );
}
