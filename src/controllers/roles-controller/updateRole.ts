import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { idsArrayToPermissionObj } from "./idsArrayToPermissionObj";

type permissionIdType = number;

function updateRoleFunction(req: Request, res: Response) {
  let id: string | null = req.body.id,
    permissions: permissionIdType[] | null = req.body.permissions;

  if (id && permissions) {
    const newpermissions = idsArrayToPermissionObj(permissions);
    prisma.role
      .update({
        where: { id },
        data: {
          permissions: {
            set: newpermissions,
          },
        },
      })
      .then((result) => {
        res.json(successResponse({ result }));
        console.log(result);
      })
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  } else {
    res.json(errorResponse(undefined, "Please Enter a valid data"));
  }
}
export { updateRoleFunction };
