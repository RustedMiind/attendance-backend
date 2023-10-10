import express, { Request, Response } from "express";
import userController from "@/controllers/user-controller/UserController";
import { checkIsUser, checkIsUserWithCallback } from "@/middlewares/checkUser";
import { createAccess } from "@/controllers/access-controller/AccessController";
import { checkAccess } from "@/middlewares/checkAccess";

const router = express.Router();

router.post("/new", userController.createNewUser);
router.post("/login", userController.login);
router.get("/check", userController.checkUserByToken);
router.post("/role/assign", userController.assignRole);
router.post("/test", checkAccess("role", 1), (req: Request, res: Response) => {
  res.json("he does have access");
});
export default router;
