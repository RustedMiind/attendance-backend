import loginFunction from "./login";
import createNewUserFunction from "./createNewUser";
import assignRoleFunction from "./assignRole";

const createNewUser = createNewUserFunction;
const login = loginFunction;
const assignRole = assignRoleFunction;

export default { createNewUser, login, assignRole };
