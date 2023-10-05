import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import validator from "validator";
import bcrypt from "bcrypt";
import { token } from "./createToken";

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
    res.status(202).json(user);
  } catch (error) {
    res.status(401).json(error);
    console.log(error);
  }
};

/*
Login Logic :
  if username or email with the password are correct
    if token exist update it, if not create new one
  Any Action requires login, will use that token,
  the token containes hashed token id
*/
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
          userWithToken = await token(user.id, "update");
        } else {
          userWithToken = await token(user.id);
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
