import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import validator from "validator";
import bcrypt from "bcrypt";
import { ActionNameType } from "@/types/ActionNameType";
import { equal } from "assert";
import checkValueObjectArr from "@/functions/checkValueObjectArr";

export function createPermissionFunction(
  name: string,
  value: number,
  actionName: ActionNameType
) {
  return new Promise((ressolve, reject) => {
    let filterObj: FilterObjType = { value };
    prisma.permission
      .findFirst({
        where: {
          name,
          action: filterObj,
        },

        include: {
          action: true,
        },
      })
      .then((permission) => {
        if (permission) {
          ressolve(permission);
        } else {
          prisma.permission
            .create({
              data: {
                name,
                action: {
                  connectOrCreate: {
                    where: { value: value },
                    create: {
                      value,
                      name: actionName,
                    },
                  },
                },
              },
              include: { action: true },
            })
            .then((permission) => {
              ressolve(permission);
            })
            .catch(() => {
              reject(errorResponse({}, "Error Creating Permission"));
            });
        }
      })
      .catch(() => {
        reject(errorResponse({}, "Error Creating Permission"));
      });
  });
}
type FilterObjType =
  | {
      name: string;
    }
  | {
      value: number;
    };
