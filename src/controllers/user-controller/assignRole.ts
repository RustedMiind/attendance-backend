import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import validator from "validator";
import bcrypt from "bcrypt";

const assignRoleFunction = (req: Request, res: Response) => {
  const body = req.body;
  let userId: string | undefined = body.userId,
    roleId: string | undefined = body.roleId;
  prisma.user
    .update({ where: { id: userId }, data: { roleId } })
    .then((user) => {
      res.status(200).json(successResponse(user));
    })
    .catch((err) => {
      res.status(402).json(errorResponse(err));
    });
};

export default assignRoleFunction;
