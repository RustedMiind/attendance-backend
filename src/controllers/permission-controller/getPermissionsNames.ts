import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { removeDuplicates } from "@/functions/removeDuplicates";

export function getpermissionsNamesFunction(req: Request, res: Response) {
  prisma.permission
    .findMany()
    .then((permissions) => {
      const unique = removeDuplicates(
        permissions.map((permission) => permission.name)
      );
      res.status(200).json(successResponse(unique));
    })
    .catch((err) => {
      res.status(400).json(errorResponse(err));
    });
}
