"use client";

import { AdminGate } from "../../../components/AdminGate";
import { PageHeader } from "../../../components/ui";
import { WordForm } from "../../../components/WordForm";

export default function NewWordPage() {
  return (
    <AdminGate>
      <PageHeader title="Add Word" />
      <WordForm />
    </AdminGate>
  );
}
