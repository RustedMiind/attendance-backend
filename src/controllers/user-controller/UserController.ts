import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import validator from "validator";
import bcrypt from "bcrypt";
import { createToken, updateToken } from "./createToken";

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
// Make The login create token in the database
const login = async (req: Request, res: Response) => {
  const body = req.body;
  const username = body.username,
    email = body.email,
    password = body.password;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    include: {
      userToken: true,
    },
  });
  if (user) {
    bcrypt.compare(password, user.password, async (err, same) => {
      if (err) {
        res
          .status(406)
          .json(errorResponse(null, "Failed To Compare Passwords"));
      } else if (same) {
        let userWithToken;
        if (user.userToken) {
          userWithToken = await updateToken(user.id);
        } else {
          userWithToken = await createToken(user.id);
        }
        res
          .status(202)
          .json(successResponse(userWithToken, "Logged In Successfully"));
      } else {
        res.status(401).json(errorResponse(null, "Password is incorrect"));
      }
    });
  } else {
    res
      .status(400)
      .json(errorResponse(null, "Username or Email are incorrect"));
  }
};

export default { createNewUser, login };
