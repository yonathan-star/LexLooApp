"use client";

import { useEffect, useState } from "react";
import { AdminGate } from "../../components/AdminGate";
import { PageHeader, Table, Button, Card } from "../../components/ui";
import { apiRequest, apiDownload } from "../../lib/api";

interface TileRow {
  id: string;
  tileCode: string;
  status: string;
  word?: { text: string } | null;
  pack?: { name: string } | null;
  batch?: { id: string; batchName: string } | null;
}

interface WordOption {
  id: string;
  text: string;
}

interface PackOption {
  id: string;
  name: string;
  packWords?: { word: { id: string } }[];
}

// Screens 70-72: Admin Tile Code List, Tile Assignment, and QR Batch
// Generator combined on one page since they share the same data and are
// all part of the same "map physical tiles to digital words" workflow.
export default function TilesPage() {
  const [tiles, setTiles] = useState<TileRow[]>([]);
  const [words, setWords] = useState<WordOption[]>([]);
  const [packs, setPacks] = useState<PackOption[]>([]);
  const [assignCode, setAssignCode] = useState("");
  const [assignWordId, setAssignWordId] = useState("");
  const [assignPackId, setAssignPackId] = useState("");
  const [assignMessage, setAssignMessage] = useState<string | null>(null);

  const [batchName, setBatchName] = useState("");
  const [batchCount, setBatchCount] = useState(50);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  function reload() {
    apiRequest<TileRow[]>("/tiles").then(setTiles).catch(() => undefined);
  }

  useEffect(() => {
    reload();
    apiRequest<WordOption[]>("/words").then(setWords).catch(() => undefined);
    apiRequest<PackOption[]>("/packs").then(setPacks).catch(() => undefined);
  }, []);

  async function handleAssign() {
    setAssignMessage(null);
    try {
      await apiRequest("/tiles/assign", {
        method: "PATCH",
        body: { tileCode: assignCode, wordId: assignWordId, packId: assignPackId || undefined },
      });
      setAssignMessage("Tile assigned successfully.");
      setAssignCode("");
      setAssignWordId("");
      setAssignPackId("");
      reload();
    } catch (err) {
      setAssignMessage(err instanceof Error ? err.message : "Failed to assign tile");
    }
  }

  async function handleGenerateBatch() {
    setBatchMessage(null);
    try {
      const result = await apiRequest<{ batch: { id: string }; codes: string[] }>("/tiles/batches", {
        method: "POST",
        body: { batchName, count: batchCount },
      });
      setBatchMessage(`Generated ${result.codes.length} codes.`);
      reload();
    } catch (err) {
      setBatchMessage(err instanceof Error ? err.message : "Failed to generate batch");
    }
  }

  async function handleExport(batchId: string) {
    const csv = await apiDownload(`/tiles/batches/${batchId}/export`);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lexloo-tiles-${batchId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const batchIds = Array.from(new Set(tiles.filter((t) => t.batch).map((t) => t.batch!.id)));

  return (
    <AdminGate>
      <PageHeader title="Tiles" />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <h2 className="text-textPrimary font-bold mb-3">Assign Tile to Word</h2>
          <div className="flex flex-col gap-2">
            <input placeholder="Tile code" value={assignCode} onChange={(e) => setAssignCode(e.target.value)} />
            <select value={assignWordId} onChange={(e) => setAssignWordId(e.target.value)}>
              <option value="">Select word...</option>
              {words.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.text}
                </option>
              ))}
            </select>
            <select value={assignPackId} onChange={(e) => setAssignPackId(e.target.value)}>
              <option value="">Auto-select pack...</option>
              {packs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Button onClick={handleAssign}>Assign</Button>
            {assignMessage ? <p className="text-sm text-textSecondary">{assignMessage}</p> : null}
          </div>
        </Card>

        <Card>
          <h2 className="text-textPrimary font-bold mb-3">Generate QR Batch</h2>
          <div className="flex flex-col gap-2">
            <input placeholder="Batch name" value={batchName} onChange={(e) => setBatchName(e.target.value)} />
            <input type="number" min={1} max={5000} value={batchCount} onChange={(e) => setBatchCount(Number(e.target.value))} />
            <Button onClick={handleGenerateBatch}>Generate</Button>
            {batchMessage ? <p className="text-sm text-textSecondary">{batchMessage}</p> : null}
          </div>
        </Card>
      </div>

      {batchIds.length ? (
        <div className="flex gap-2 mb-4">
          {batchIds.map((id) => (
            <Button key={id} variant="ghost" onClick={() => handleExport(id)}>
              Export CSV: {id.slice(0, 8)}
            </Button>
          ))}
        </div>
      ) : null}

      <Table headers={["Code", "Word", "Pack", "Status"]}>
        {tiles.map((t) => (
          <tr key={t.id}>
            <td className="px-4 py-3 text-textPrimary font-mono">{t.tileCode}</td>
            <td className="px-4 py-3 text-textSecondary">{t.word?.text ?? "-"}</td>
            <td className="px-4 py-3 text-textSecondary">{t.pack?.name ?? "-"}</td>
            <td className="px-4 py-3 text-textSecondary">{t.status}</td>
          </tr>
        ))}
      </Table>
    </AdminGate>
  );
}
