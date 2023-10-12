import prisma from "@/prisma";
import { ActionNameType } from "@/types/ActionNameType";
import { NextFunction, Request, Response } from "express";
import { checkIsUserWithCallback } from "./checkUser";
import { UserWithRoleResult } from "@/types/UserTypes";
import { errorResponse } from "@/statics/responses";
import { PermissionNamesType } from "@/types/PermissionNamesType";

function checkpermission(
  permissionName: PermissionNamesType,
  actionValue: 0 | 1 | 2
) {
  return function (req: Request, res: Response, next: NextFunction) {
    checkIsUserWithCallback(
      req,
      res,
      function callback(user: UserWithRoleResult) {
        // Check if the role that the user has contains the required permission or not
        let haspermission = false;

        if (user) {
          if (user.role === null && actionValue === 0) {
            next();
            return;
          } else if (user.role) {
            user.role.permissions.forEach((permission) => {
              if (
                permission.name === permissionName &&
                permission.action.value >= actionValue
              ) {
                haspermission = true;
              }
            });
          }
          if (haspermission) {
            next();
          } else {
            res.status(403).json(errorResponse({}, "permission Denied"));
          }
        }
      }
    );
  };
}

export { checkpermission };
