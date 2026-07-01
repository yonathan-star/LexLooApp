"use client";

import { useParams } from "next/navigation";
import { AdminGate } from "../../../components/AdminGate";
import { PageHeader } from "../../../components/ui";
import { PackForm } from "../../../components/PackForm";

export default function EditPackPage() {
  const params = useParams<{ id: string }>();
  return (
    <AdminGate>
      <PageHeader title="Edit Pack" />
      <PackForm packId={params.id} />
    </AdminGate>
  );
}
