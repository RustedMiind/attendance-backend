import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { checkIsUserWithCallback } from "@/middlewares/checkUser";
import { getNoPermissionTo } from "./functions/getNoPermissionTo";
import { Prisma } from "@prisma/client";

const assignRoleFunction = (req: Request, res: Response) => {
  const body = req.body;
  let userId: string | undefined = body.userId,
    roleId: string | undefined = body.roleId;

  checkIsUserWithCallback(req, res, (requester) => {
    prisma.user
      .findUnique({
        where: { id: userId },
        include: { role: { include: { permissions: true } } },
      })
      .then((userToAssign) => {
        if (userToAssign) {
          if (userToAssign.roleId === null) {
            prisma.role
              .findUnique({
                where: { id: roleId },
                include: { permissions: { include: { action: true } } },
              })
              .then((role) => {
                if (role && requester && requester.role) {
                  // If the user has the access to all its permissions
                  const haveNoPermissionTo = getNoPermissionTo(
                    requester.role.permissions,
                    role.permissions
                  );
                  if (haveNoPermissionTo.length === 0) {
                    // Here you finally can assign the role to the user
                    prisma.user
                      .update({
                        where: { id: userId },
                        data: { roleId: role.id },
                      })
                      .then((user) => {
                        res.status(200).json(
                          successResponse({
                            user,
                            requester,
                            role,
                            haveNoPermissionTo,
                          })
                        );
                      })
                      .catch((err) => {
                        res.status(402).json(errorResponse(err));
                      });
                  } else {
                    res
                      .status(403)
                      .json(
                        errorResponse(
                          haveNoPermissionTo,
                          "Permissions you dont have exists in the requested role"
                        )
                      );
                  }
                } else {
                  res
                    .status(404)
                    .json(
                      errorResponse(
                        undefined,
                        "Role not found, Please enter a valid id"
                      )
                    );
                }
              });
          } else {
            res
              .status(409)
              .json(errorResponse(undefined, "User Already has a role"));
          }
        } else {
          res.status(404).json(errorResponse(undefined, "User not found"));
        }
      })
      .catch(() => {});
  });
  // prisma.user
  //   .update({ where: { id: userId }, data: { roleId } })
  //   .then((user) => {
  //     res.status(200).json(successResponse(user));
  //   })
  //   .catch((err) => {
  //     res.status(402).json(errorResponse(err));
  //   });
};

export default assignRoleFunction;
