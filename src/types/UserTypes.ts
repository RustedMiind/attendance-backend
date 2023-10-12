import { Prisma } from "@prisma/client";
import { type } from "os";

type UserWithRole = Prisma.UserGetPayload<{
  include: {
    role: { include: { permissions: { include: { action: true } } } };
  };
}>;
type UserWithRoleResult = UserWithRole | null;

export type { UserWithRole, UserWithRoleResult };
