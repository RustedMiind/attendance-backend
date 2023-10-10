import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import bcrypt from "bcrypt";
import { token } from "./createToken";
import jwt from "jsonwebtoken";

function checkUser(req: Request, res: Response) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY as string, function (err, tkn) {
      if (err) {
        res
          .status(401)
          .json(errorResponse(undefined, "Invalid token, Login Again"));
      } else if (tkn) {
        const tokenObj = tkn as { id: string };
        prisma.userToken
          .findFirst({
            where: {
              id: tokenObj.id,
            },
          })
          .then((userToken) => {
            console.log(userToken);
            if (userToken) {
              prisma.user
                .findFirst({ where: { id: userToken.userId } })
                .then((user) => {
                  if (user) {
                    const { password, ...noPassword } = user;
                    res
                      .status(202)
                      .json(
                        successResponse(
                          { user: noPassword },
                          "Logged in Successfully"
                        )
                      );
                  } else {
                    res
                      .status(404)
                      .json(
                        errorResponse(
                          undefined,
                          "User Not found, It might be deleted, Try to login again"
                        )
                      );
                  }
                })
                .catch((err) => {
                  res
                    .status(404)
                    .json(
                      errorResponse(
                        err,
                        "User Not found, It might be deleted, Try to login again"
                      )
                    );
                });
            } else {
              res.status(404).json(errorResponse(undefined, "Token not found"));
            }
          })
          .catch((err) => {
            res.status(404).json(errorResponse(err, "Error parsing token"));
          });
      } else {
        res.status(404).json(errorResponse(undefined, "Error parsing token"));
      }
    });
  } else {
    res
      .status(401)
      .json(errorResponse(undefined, "No Login Sessions, Login then proceed"));
  }
}

export default checkUser;
