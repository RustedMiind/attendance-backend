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
      res.json(errorResponse(err, "No token found"));
    });
}

function checkUser(token: string | undefined) {
  return new Promise<UserWithRoleResult>((ressolve, reject) => {
    if (!token) return reject(errorResponse({}, "No token found"));

    let decode: { id: string } | undefined;

    try {
      decode = jwt.verify(token, process.env.SECRET_KEY as string) as {
        id: string;
      };
      if (typeof decode === "object") {
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
                    role: { include: { accesses: true } },
                  },
                })
                .then((user) => {
                  ressolve(user);
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              reject(userToken);
            }
          })
          .catch(reject);
      }
    } catch (err) {
      reject(err);
    }
  });
}

export { checkIsUser, checkIsUserWithCallback };
