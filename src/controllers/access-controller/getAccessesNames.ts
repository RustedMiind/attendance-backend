import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { access } from "fs";
import { removeDuplicates } from "@/functions/removeDuplicates";

export function getAccessesNamesFunction(req: Request, res: Response) {
  prisma.access
    .findMany()
    .then((accesses) => {
      const unique = removeDuplicates(accesses.map((access) => access.name));
      res.status(200).json(successResponse(unique));
    })
    .catch((err) => {
      res.status(400).json(errorResponse(err));
    });
}
