import { AccessesNamesType } from "@/types/AccessesNamesType";

function idsArrayToAccessObj(ids: number[]) {
  return ids.map((accessId) => {
    return {
      id: accessId,
    };
  });
}

function namesArrayToAccessObj(names: AccessesNamesType[]) {
  return names.map((accessesNames) => {
    return {
      name: accessesNames,
    };
  });
}

export { idsArrayToAccessObj, namesArrayToAccessObj };
