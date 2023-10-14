import { Prisma } from "@prisma/client";

function excludePassword(user: UserType): Omit<UserType, "password"> {
  const { password, ...data } = user;
  return data;
}

type UserType = Prisma.UserGetPayload<{
  include: {
    role: { include: { permissions: { include: { action: true } } } };
  };
}>;

export default excludePassword;
