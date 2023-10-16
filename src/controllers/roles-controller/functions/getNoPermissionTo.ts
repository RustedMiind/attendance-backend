import { Prisma } from "@prisma/client";

/*
Issue Found,
If the user have two same permissions with different action values
the comparision will return that the lower value means that the user doesnt have access to it 
*/

export function getNoPermissionTo(
  userPermissions: PermissionType[],
  permissionsToCheck: PermissionType[]
): PermissionType[] {
  const noPermissionTo: any[] = [];
  userPermissions.forEach((permissionToCheck) => {
    let haveAccess = false;
    // Conpare user roles to check if he has access to give the permission
    permissionsToCheck.forEach((userPermission) => {
      // console.log(
      //   `${permissionToCheck.action.value} <= ${
      //     userPermission.action.value
      //   } : ${permissionToCheck.action.value <= userPermission.action.value}`,
      //   `
      //     ${permissionToCheck.action.name} === ${
      //     userPermission.action.name
      //   } : ${permissionToCheck.action.name === userPermission.action.name}
      //   `
      // );
      if (
        permissionToCheck.action.name === userPermission.action.name &&
        permissionToCheck.action.value <= userPermission.action.value
      ) {
        haveAccess = true;
      }
    });
    if (!haveAccess) {
      noPermissionTo.push(permissionToCheck);
    }
  });
  return noPermissionTo;
}

export type PermissionType = Prisma.PermissionGetPayload<{
  include: { action: true };
}>;
