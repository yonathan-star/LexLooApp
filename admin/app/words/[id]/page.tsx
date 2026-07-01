"use client";

import { useParams } from "next/navigation";
import { AdminGate } from "../../../components/AdminGate";
import { PageHeader } from "../../../components/ui";
import { WordForm } from "../../../components/WordForm";

export default function EditWordPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminGate>
      <PageHeader title="Edit Word" />
      <WordForm wordId={params.id} />
    </AdminGate>
  );
}
