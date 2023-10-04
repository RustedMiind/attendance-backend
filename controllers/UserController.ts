import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import validator from "validator";
import bcrypt from "bcrypt";
import { equal } from "assert";

const createNewUser = async (req: Request, res: Response) => {
  const body = req.body;
  let hashed = await bcrypt.hash(body.password, 10);
  let data: any = {};
  data.name = body.name ? body.name : null;
  data.email = validator.isEmail(body.email) ? body.email : null;
  data.username = body.username || null;
  data.password = hashed;
  try {
    const user = await prisma.user.create({ data });
    res.json(user);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

const login = async (req: Request, res: Response) => {
  const body = req.body;
  const username = body.username,
    email = body.email,
    password = body.password;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  console.log(user);
  res.json(user);
};

export default { createNewUser, login };
