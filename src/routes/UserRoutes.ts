import express, { Request, Response } from "express";
import userController from "@/controllers/user-controller/UserController";
import { checkIsUser, checkIsUserWithCallback } from "@/middlewares/checkUser";

const router = express.Router();

router.post("/new", userController.createNewUser);
router.post("/login", userController.login);
router.post("/test", (req: Request, res: Response) => {
  checkIsUserWithCallback(req, res, () => {
    res.json("test worked");
  });
});
export default router;
