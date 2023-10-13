import prisma from "@/prisma";
import { PermissionType } from "./getNoPermissionTo";
import { Prisma } from "@prisma/client";

function CreateRolePromise(data: ParamsType) {
  return new Promise<ResponseType>((ressolve, reject) => {
    prisma.role
      .create({
        data: {
          name: data.name,
          permissions: {
            connect: data.resultPermissions,
          },
        },
        include: {
          permissions: {
            include: {
              action: true,
            },
          },
        },
      })
      .then(ressolve)
      .catch(reject);
  });
}

type ParamsType = {
  name: string;
  resultPermissions: PermissionType[];
};
type ResponseType = Prisma.RoleGetPayload<{
  include: { permissions: { include: { action: true } } };
}>;
export default CreateRolePromise;
