"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "./ui";
import { apiRequest } from "../lib/api";

interface Language {
  id: string;
  name: string;
}

interface WordOption {
  id: string;
  text: string;
}

interface PackValue {
  name: string;
  slug: string;
  languageId: string;
  level: string;
  category: string;
  sku: string;
  description: string;
  status: "draft" | "published";
}

const EMPTY: PackValue = { name: "", slug: "", languageId: "", level: "", category: "", sku: "", description: "", status: "draft" };

interface FetchedPack {
  name: string;
  slug: string;
  languageId: string;
  level?: string | null;
  category?: string | null;
  sku?: string | null;
  description?: string | null;
  status: "draft" | "published";
  packWords?: { word: { id: string } }[];
}

// Screen 69: Admin Pack Editor — pack metadata, word assignment/order, SKU.
export function PackForm({ packId }: { packId?: string }) {
  const router = useRouter();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [allWords, setAllWords] = useState<WordOption[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [value, setValue] = useState<PackValue>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest<Language[]>("/languages").then(setLanguages).catch(() => undefined);
    apiRequest<WordOption[]>("/words").then(setAllWords).catch(() => undefined);
    if (packId) {
      apiRequest<FetchedPack>(`/packs/${packId}`).then((p) => {
        setValue({
          name: p.name,
          slug: p.slug,
          languageId: p.languageId,
          level: p.level ?? "",
          category: p.category ?? "",
          sku: p.sku ?? "",
          description: p.description ?? "",
          status: p.status,
        });
        setSelectedWordIds((p.packWords ?? []).map((pw) => pw.word.id));
      });
    }
  }, [packId]);

  function update<K extends keyof PackValue>(key: K, val: PackValue[K]) {
    setValue((v) => ({ ...v, [key]: val }));
  }

  function toggleWord(id: string) {
    setSelectedWordIds((ids) => (ids.includes(id) ? ids.filter((w) => w !== id) : [...ids, id]));
  }

  async function handleSave(publish: boolean) {
    setError(null);
    if (!value.name.trim() || !value.slug.trim() || !value.languageId) {
      setError("Name, slug, and language are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...value, status: publish ? "published" : "draft" };
      let id = packId;
      if (id) {
        await apiRequest(`/packs/${id}`, { method: "PATCH", body: payload });
      } else {
        const created = await apiRequest<{ id: string }>("/packs", { method: "POST", body: payload });
        id = created.id;
      }
      await apiRequest(`/packs/${id}/words`, { method: "POST", body: { wordIds: selectedWordIds } });
      router.push("/packs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save pack");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-3xl">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="Name">
          <input value={value.name} onChange={(e) => update("name", e.target.value)} className="w-full" />
        </Field>
        <Field label="Slug">
          <input value={value.slug} onChange={(e) => update("slug", e.target.value)} className="w-full" />
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
        <Field label="Level">
          <input value={value.level} onChange={(e) => update("level", e.target.value)} className="w-full" />
        </Field>
        <Field label="Category">
          <input value={value.category} onChange={(e) => update("category", e.target.value)} className="w-full" />
        </Field>
        <Field label="SKU">
          <input value={value.sku} onChange={(e) => update("sku", e.target.value)} className="w-full" />
        </Field>
      </div>
      <Field label="Description">
        <textarea value={value.description} onChange={(e) => update("description", e.target.value)} className="w-full" rows={2} />
      </Field>

      <h3 className="text-textPrimary font-bold mt-4 mb-2">Words in this pack ({selectedWordIds.length})</h3>
      <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-2">
        {allWords.map((w) => (
          <label key={w.id} className="flex items-center gap-2 px-2 py-1 text-sm text-textSecondary">
            <input type="checkbox" checked={selectedWordIds.includes(w.id)} onChange={() => toggleWord(w.id)} />
            {w.text}
          </label>
        ))}
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
