import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import { idsArrayToPermissionObj } from "./idsArrayToPermissionObj";
import { checkIsUserWithCallback } from "@/middlewares/checkUser";
import { removeDuplicates } from "@/functions/removeDuplicates";
import { Prisma } from "@prisma/client";
import { getNoPermissionTo } from "./functions/getNoPermissionTo";
import CreateRolePromise from "./functions/createRolePromise";
import { includeRoleToAction } from "@/statics/includes";

type PermissionIdType = number;

function createRoleFunction(req: Request, res: Response) {
  const name: string | undefined = req.body.name,
    permissions: PermissionIdType[] | undefined = removeDuplicates(
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
            if (permissions.length === resultPermissions.length && user.role) {
              // If Requested permissions all found
              // res.json(resultPermissions);
              const noPermissionTo = getNoPermissionTo(
                user.role.permissions,
                resultPermissions
              );
              console.log(noPermissionTo);
              if (noPermissionTo.length === 0) {
                //  Here he can Create the role needed
                CreateRolePromise({ name, resultPermissions })
                  .then((result) => {
                    prisma.role
                      .findMany(includeRoleToAction)
                      .then((roles) => {
                        res.status(200).json(successResponse(roles));
                      })
                      .catch(() => {
                        res.status(200).json(successResponse([]));
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(errorResponse(err));
                  });
              } else {
                res.status(401).json(
                  errorResponse(
                    {
                      permissionDenied: noPermissionTo,
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
  } else {
    res.status(401).json(errorResponse(undefined, "Please Enter Valid Inputs"));
  }
}

export { createRoleFunction };
