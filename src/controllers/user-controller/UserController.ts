import loginFunction from "./login";
import createNewUserFunction from "./createNewUser";
import checkUser from "./checkUser";

const createNewUser = createNewUserFunction;
const login = loginFunction;
const checkUserByToken = checkUser;

export default { createNewUser, login, checkUserByToken };
