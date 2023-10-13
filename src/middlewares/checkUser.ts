import prisma from "@/prisma";
import { errorResponse } from "@/statics/responses";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserWithRoleResult } from "@/types/UserTypes";

/*
  Get the token from the header named "Authorization"
  if the token is valid token:
    the token is object containes "id" key
    find 
*/

/*   
USAGE :
router.post("/path", checkIsUser, yourControllerFunction);
*/
function checkIsUser(req: Request, res: Response, next: NextFunction) {
  checkUser(req.headers.authorization)
    .then(() => {
      next();
    })
    .catch((err) => {
      res.status(404).json(errorResponse({ err }));
    });
}

/*   
USAGE :
router.post("/path", (req: Request, res: Response) => {
  checkIsUserWithCallback(req, res, callback);
});
*/
function checkIsUserWithCallback(
  req: Request,
  res: Response,
  callback: (v: UserWithRoleResult) => unknown
) {
  checkUser(req.headers.authorization)
    .then((result) => {
      callback(result);
    })
    .catch((err) => {
      res
        .status(400)
        .json(
          errorResponse(err, "Token Validation Failed, Login again to proceed")
        );
    });
}

function checkUser(token: string | undefined) {
  return new Promise<UserWithRoleResult>((ressolve, reject) => {
    if (!token) return reject("No token found");

    let decode: { id: string } | undefined;

    try {
      decode = jwt.verify(token, process.env.SECRET_KEY as string) as {
        id: string;
      };
      if (typeof decode === "object" && decode.id) {
        prisma.userToken
          .findFirst({ where: { id: decode.id } })
          .then((userToken) => {
            if (userToken && typeof userToken === "object") {
              prisma.user
                .findFirst({
                  where: {
                    id: userToken.userId,
                  },
                  include: {
                    role: {
                      include: { permissions: { include: { action: true } } },
                    },
                  },
                })
                .then((user) => {
                  ressolve(user);
                })
                .catch((err) => {
                  reject("::test::");
                });
            } else {
              reject("userToken not fouund");
            }
          })
          .catch((err) => {
            reject("err");
          });
      } else {
        reject("Token Decode not of type object");
      }
    } catch (err) {
      reject("err::2::");
    }
  });
}

export { checkIsUser, checkIsUserWithCallback };
