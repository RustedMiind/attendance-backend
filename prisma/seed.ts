import { ActionNameType } from "@/types/ActionNameType";
import { AccessesNamesType } from "../src/types/AccessesNamesType";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type actionType = {
  name: ActionNameType;
  value: number;
};
const actionsData: actionType[] = [
  {
    name: "no_action",
    value: 0,
  },
  {
    name: "readonly",
    value: 1,
  },
  {
    name: "read_write",
    value: 2,
  },
];
const accessesNames: AccessesNamesType[] = ["access", "role", "user_data"];
const actionValues = [0, 1, 2];

function seedActions() {
  return new Promise((ressolve, reject) => {
    prisma.action
      .createMany({ data: actionsData })
      .then((result) => {
        ressolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function seedAccesses() {
  prisma.action
    .findMany()
    .then((actions) => {
      const actionIds = actions.map((action) => action.id);
      const accessesData: Prisma.AccessCreateManyInput[] = [];
      accessesNames.forEach((access) => {
        const tempArr = [];
        actionIds.forEach((actionId) => {
          accessesData.push({ name: access, actionId });
        });
      });
      prisma.access
        .createMany({ data: accessesData })
        .then(console.log)
        .catch(console.log);
    })
    .catch(console.log);
}
seedActions().then(seedAccesses);
