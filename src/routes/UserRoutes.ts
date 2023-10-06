import express, { Request, Response } from "express";
import userController from "@/controllers/user-controller/UserController";
import { checkIsUser, checkIsUserWithCallback } from "@/middlewares/checkUser";
import { createAccess } from "@/controllers/access-controller/AccessController";

const router = express.Router();

router.post("/new", userController.createNewUser);
router.post("/login", userController.login);
router.post("/test", (req: Request, res: Response) => {
  // const body = req.body;
  createAccess("killswasdasdasdasd", 2, "readonly")
    .then((result) => {
      res.status(202).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});
export default router;
