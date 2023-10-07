import prisma from "@/prisma";
import { ActionNameType } from "@/types/ActionNameType";
import { NextFunction, Request, Response } from "express";
import { checkIsUserWithCallback } from "./checkUser";
import { UserWithRoleResult } from "@/types/UserTypes";
import { errorResponse } from "@/statics/responses";

function checkAccess(accessName: string, actionValue: 0 | 1 | 2) {
  return function (req: Request, res: Response, next: NextFunction) {
    checkIsUserWithCallback(
      req,
      res,
      function callback(user: UserWithRoleResult) {
        // Check if the role that the user has contains the required access or not
        let hasAccess = false;

        if (user) {
          if (user.role === null && actionValue === 0) {
            next();
            return;
          } else if (user.role) {
            user.role.accesses.forEach((access) => {
              if (
                access.name === accessName &&
                access.action.value >= actionValue
              ) {
                hasAccess = true;
              }
            });
          } else {
            res.status(403).json(errorResponse({}, "Access Denied"));
          }
        }
      }
    );
  };
}
