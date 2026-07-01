"use client";

import { AdminGate } from "../../../components/AdminGate";
import { PageHeader } from "../../../components/ui";
import { PackForm } from "../../../components/PackForm";

export default function NewPackPage() {
  return (
    <AdminGate>
      <PageHeader title="Create Pack" />
      <PackForm />
    </AdminGate>
  );
}
