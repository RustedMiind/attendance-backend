import prisma from "@/prisma";
import { ActionNameType } from "@/types/ActionNameType";
import { NextFunction, Request, Response } from "express";
import { checkIsUserWithCallback } from "./checkUser";
import { UserWithRoleResult } from "@/types/UserTypes";

function checkAccess(accessName: string, actionName: ActionNameType) {
  return function (req: Request, res: Response, next: NextFunction) {
    checkIsUserWithCallback(
      req,
      res,
      function callback(user: UserWithRoleResult) {
        // Check if the role that the user has contains the required access or not
      }
    );
  };
}
