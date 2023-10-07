import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import validator from "validator";
import bcrypt from "bcrypt";

const createNewUserFunction = async (req: Request, res: Response) => {
  const body = req.body;
  let hashed = await bcrypt.hash(body.password, 10);
  let data: any = {};
  data.name = body.name ? body.name : null;
  data.email = validator.isEmail(body.email) ? body.email : null;
  data.username = body.username || null;
  data.password = hashed;
  try {
    const user = await prisma.user.create({ data });
    res.status(202).json(successResponse(user));
  } catch (error) {
    res.status(401).json(errorResponse(error));
    console.log(error);
  }
};

export default createNewUserFunction;
