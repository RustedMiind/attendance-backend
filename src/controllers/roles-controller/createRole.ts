import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { idsArrayToPermissionObj } from "./idsArrayToPermissionObj";

type PermissionIdType = number;

function createRoleFunction(req: Request, res: Response) {
  let name: string | null = req.body.name,
    permissions: PermissionIdType[] | null = req.body.permissions;

  if (name && permissions) {
    prisma.role
      .create({
        data: {
          name,
          permissions: {
            connect: idsArrayToPermissionObj(permissions),
          },
        },
        include: {
          permissions: {
            include: { action: { select: { value: true, name: true } } },
          },
        },
      })
      .then((result) => {
        res.status(200).json(successResponse(result));
      })
      .catch((err) => {
        res.status(400).json(errorResponse(err));
      });
  }
}
export { createRoleFunction };
