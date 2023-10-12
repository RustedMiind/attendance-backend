import { PermissionNamesType } from "@/types/PermissionNamesType";

function idsArrayToPermissionObj(ids: number[]) {
  return ids.map((permissionId) => {
    return {
      id: permissionId,
    };
  });
}

function namesArrayToPermissionObj(names: PermissionNamesType[]) {
  return names.map((permissionsNames) => {
    return {
      name: permissionsNames,
    };
  });
}

export { idsArrayToPermissionObj, namesArrayToPermissionObj };
