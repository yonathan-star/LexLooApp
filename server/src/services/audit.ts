import { prisma } from "../lib/prisma";

export async function writeAudit(
  adminUserId: string,
  action: string,
  entityType: string,
  entityId: string,
  before: unknown,
  after: unknown
) {
  await prisma.adminAuditLog.create({
    data: {
      adminUserId,
      action,
      entityType,
      entityId,
      beforeJson: before ? JSON.stringify(before) : null,
      afterJson: after ? JSON.stringify(after) : null,
    },
  });
}
