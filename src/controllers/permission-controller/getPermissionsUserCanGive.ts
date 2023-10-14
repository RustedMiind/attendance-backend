import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { removeDuplicates } from "@/functions/removeDuplicates";
import { checkIsUserWithCallback } from "@/middlewares/checkUser";
import { Prisma } from "@prisma/client";

function getPermissionsUserCanGiveFunction(req: Request, res: Response) {
  checkIsUserWithCallback(req, res, (user) => {
    if (
      user &&
      user.role &&
      user.role.permissions &&
      Array.isArray(user.role.permissions)
    ) {
      const query: Prisma.PermissionFindManyArgs = {
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
          res.status(200).json(successResponse(permissions));
        })
        .catch((err) => {
          res.status(401).json(errorResponse(err));
        });
    } else {
      res.json("nigga");
    }
  });
}

export default getPermissionsUserCanGiveFunction;
