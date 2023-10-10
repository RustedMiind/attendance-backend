import loginFunction from "./login";
import createNewUserFunction from "./createNewUser";
import assignRoleFunction from "./assignRole";
import checkUser from "./checkUser";

const createNewUser = createNewUserFunction;
const login = loginFunction;
const assignRole = assignRoleFunction;
const checkUserByToken = checkUser;

export default { createNewUser, login, assignRole, checkUserByToken };
