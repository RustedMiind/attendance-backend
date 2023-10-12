import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { idsArrayToAccessObj } from "./idsArrayToAccessObj";

type AccessIdType = number;

function updateRoleFunction(req: Request, res: Response) {
  let id: string | null = req.body.id,
    accesses: AccessIdType[] | null = req.body.accesses;

  if (id && accesses) {
    const newAccesses = idsArrayToAccessObj(accesses);
    prisma.role
      .update({
        where: { id },
        data: {
          accesses: {
            set: newAccesses,
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
