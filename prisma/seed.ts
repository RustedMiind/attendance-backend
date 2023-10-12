import { ActionNameType } from "@/types/ActionNameType";
import { PermissionNamesType } from "../src/types/PermissionNamesType";
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
const permissionsNames: PermissionNamesType[] = [
  "permission",
  "role",
  "user_data",
];
const actionValues = [0, 1, 2];

function seedActions() {
  return new Promise((ressolve, reject) => {
    prisma.action
      .deleteMany()
      .then(() => {
        prisma.action
          .createMany({ data: actionsData })
          .then((result) => {
            ressolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch(console.log);
  });
}
function seedPermissions() {
  prisma.action
    .findMany()
    .then((actions) => {
      const actionIds = actions.map((action) => action.id);
      const permissionsData: Prisma.PermissionCreateManyInput[] = [];
      permissionsNames.forEach((permission) => {
        const tempArr = [];
        actionIds.forEach((actionId) => {
          permissionsData.push({ name: permission, actionId });
        });
      });
      prisma.permission
        .createMany({ data: permissionsData })
        .then(console.log)
        .catch(console.log);
    })
    .catch(console.log);
}
seedActions().then(seedPermissions);
