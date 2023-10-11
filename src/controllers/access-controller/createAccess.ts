import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import validator from "validator";
import bcrypt from "bcrypt";
import { ActionNameType } from "@/types/ActionNameType";
import { equal } from "assert";
import checkValueObjectArr from "@/functions/checkValueObjectArr";

export function createAccessFunction(
  name: string,
  value: number,
  actionName: ActionNameType
) {
  return new Promise((ressolve, reject) => {
    let filterObj: FilterObjType = { value };
    prisma.access
      .findFirst({
        where: {
          name,
          action: filterObj,
        },

        include: {
          action: true,
        },
      })
      .then((access) => {
        if (access) {
          ressolve(access);
        } else {
          prisma.access
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
            .then((access) => {
              ressolve(access);
            })
            .catch(() => {
              reject(errorResponse({}, "Error Creating Access"));
            });
        }
      })
      .catch(() => {
        reject(errorResponse({}, "Error Creating Access"));
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