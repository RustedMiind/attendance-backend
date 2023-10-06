import { ActionNameType } from "@/types/ActionNameType";
import { PrismaClient } from "@prisma/client";
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

function main() {
  prisma.action
    .createMany({ data: actionsData })
    .then(console.log)
    .catch(console.log);
}
main();
