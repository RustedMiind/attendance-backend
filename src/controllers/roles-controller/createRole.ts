import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";

type AccessIdType = number;

function createRoleFunction(req: Request, res: Response) {
  let name: string | null = req.body.name,
    accesses: AccessIdType[] | null = req.body.accesses;

  if (name && accesses) {
    prisma.role
      .create({
        data: {
          name,
          accesses: {
            connect: accesses.map((accessId) => {
              return {
                id: accessId,
              };
            }),
          },
        },
        include: {
          accesses: {
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
