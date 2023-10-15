import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { removeDuplicates } from "@/functions/removeDuplicates";
import { checkIsUserWithCallback } from "@/middlewares/checkUser";
import { Prisma } from "@prisma/client";

function getPermissionsUserCanGiveFunction(req: Request, res: Response) {
  checkIsUserWithCallback(req, res, (user) => {
    console.log(user);
    if (
      user &&
      user.role &&
      user.role.permissions &&
      Array.isArray(user.role.permissions)
    ) {
      const query = {
        where: {
          OR: user.role.permissions.map((uPermission) => ({
            name: uPermission.name,
            action: { value: { lte: uPermission.action.value } },
          })),
        },
        include: { action: true },
      };
      prisma.permission
        .findMany(query)

        .then((permissions) => {
          const compressedPermissions: CompressedPermissionType[] = [];
          permissions.forEach((p) => {
            const compressedNames: string[] = compressedPermissions.map(
              (p) => p.name
            );
            if (compressedNames.includes(p.name)) {
              compressedPermissions.forEach((cp) => {
                if (cp.name === p.name) {
                  cp.actions.push({ name: p.action.name, permissionId: p.id });
                }
              });
            } else {
              compressedPermissions.push({
                name: p.name,
                actions: [{ name: p.action.name, permissionId: p.id }],
              });
            }
          });

          res
            .status(200)
            .json(successResponse({ permissions, compressedPermissions }));
        })
        .catch((err) => {
          res.status(401).json(errorResponse(err));
        });
    } else {
      res.status(403).json(errorResponse(undefined, "Not a user"));
    }
  });
}

type CompressedPermissionType = {
  name: string;
  actions: { name: string; permissionId: number }[];
};

export default getPermissionsUserCanGiveFunction;
