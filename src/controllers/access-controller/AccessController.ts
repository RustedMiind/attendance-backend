import { Request, Response } from "express";
import { successResponse, errorResponse } from "@/statics/responses";
import prisma from "@/prisma";
import validator from "validator";
import bcrypt from "bcrypt";
import { ActionNameType } from "@/types/ActionNameType";
import { equal } from "assert";
import checkValueObjectArr from "@/functions/checkValueObjectArr";

type FilterObjType =
  | {
      name: string;
    }
  | {
      value: number;
    };

export function createAccess(
  name: string,
  value: number,
  actionName: ActionNameType
) {
  let filterObj: FilterObjType = { value };

  return new Promise((ressolve, reject) => {
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
        // Check if access contains the value in name or value
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
            })
            .then(ressolve)
            .catch(reject);
        }
      });
  });
}
