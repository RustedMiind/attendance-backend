import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";

function getAllRolesFunction(req: Request, res: Response) {
  prisma.role
    .findMany()
    .then((roles) => {
      res
        .status(200)
        .json(successResponse(roles, "Roles Fetched Successfully"));
    })
    .catch((err) => res.status(400).json(errorResponse(err)));
}
export { getAllRolesFunction };
