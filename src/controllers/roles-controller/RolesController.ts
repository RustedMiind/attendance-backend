import { createRoleFunction } from "./createRole";
import { getAllRolesFunction } from "./getAllRoles";
import { updateRoleFunction } from "./updateRole";

const createRole = createRoleFunction;
const updateRole = updateRoleFunction;
const getAllRoles = getAllRolesFunction;

export { createRole, updateRole, getAllRoles };
