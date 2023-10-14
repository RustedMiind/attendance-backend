export const includePermissionToAction = { include: { action: true as true } };

export const includeRoleToAction = {
  include: {
    permissions: includePermissionToAction,
  },
};

export const includeUserToAction = {
  include: {
    role: includeRoleToAction,
  },
};
