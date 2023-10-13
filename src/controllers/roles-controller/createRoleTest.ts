import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { idsArrayToPermissionObj } from "./idsArrayToPermissionObj";
import { checkIsUserWithCallback } from "@/middlewares/checkUser";
import { removeDuplicates } from "@/functions/removeDuplicates";
import { Permission, Prisma } from "@prisma/client";

type PermissionIdType = number;

function createRoleFunction(req: Request, res: Response) {
  const name: string | null = req.body.name,
    permissions: PermissionIdType[] | null = removeDuplicates(
      req.body.permissions
    );

  if (
    name &&
    typeof name === "string" &&
    permissions &&
    Array.isArray(permissions)
  ) {
    checkIsUserWithCallback(req, res, (user) => {
      if (user) {
        prisma.permission
          .findMany({
            where: { OR: idsArrayToPermissionObj(permissions) },
            include: { action: true },
          })
          .then((resultPermissions) => {
            if (permissions.length === resultPermissions.length) {
              // If Requested permissions all found
              // res.json(resultPermissions);
              const haveNoAccessTo: any[] = [];
              resultPermissions.forEach((permissionToCheck) => {
                let haveAccess = false;
                // Conpare user roles to check if he has access to give the permission
                user.role?.permissions.forEach((userPermission) => {
                  if (
                    permissionToCheck.action.name ===
                      userPermission.action.name &&
                    permissionToCheck.action.value <=
                      userPermission.action.value
                  ) {
                    haveAccess = true;
                  }
                });
                if (!haveAccess) {
                  haveNoAccessTo.push(permissionToCheck);
                }
              });
              if (haveNoAccessTo.length === 0) {
                //  Here he can Create the role needed
                prisma.role
                  .create({
                    data: {
                      name,
                      permissions: {
                        connect: resultPermissions,
                      },
                    },
                    include: {
                      permissions: {
                        include: {
                          action: { select: { value: true, name: true } },
                        },
                      },
                    },
                  })
                  .then((result) => {
                    res.status(200).json(successResponse(result));
                  })
                  .catch((err) => {
                    res.status(400).json(errorResponse(err));
                  });
              } else {
                res.status(402).json(
                  errorResponse(
                    {
                      permissionDenied: haveNoAccessTo,
                    },
                    "Some Permissions the user doesn't have access to give"
                  )
                );
              }
            } else {
              res
                .status(404)
                .json(
                  errorResponse(
                    undefined,
                    `Permissions requested are ${permissions.join(
                      ", "
                    )}, but the permissions found are ${resultPermissions
                      .map((p) => p.id)
                      .join(", ")}`
                  )
                );
            }
          })
          .catch((err) => {
            res
              .status(400)
              .json(
                errorResponse(err, "Error Finding the requested permissions")
              );
          });
      }
    });
    // prisma.role
    //   .create({
    //     data: {
    //       name,
    //       permissions: {
    //         connect: idsArrayToPermissionObj(permissions),
    //       },
    //     },
    //     include: {
    //       permissions: {
    //         include: { action: { select: { value: true, name: true } } },
    //       },
    //     },
    //   })
    //   .then((result) => {
    //     res.status(200).json(successResponse(result));
    //   })
    //   .catch((err) => {
    //     res.status(400).json(errorResponse(err));
    //   });
  } else {
    res.status(401).json(errorResponse(undefined, "Please Enter Valid Inputs"));
  }
}
export { createRoleFunction };
