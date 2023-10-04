import express from "express";
import userController from "../controllers/UserController";

const router = express.Router();

router.post("/new", userController.createNewUser);
router.post("/login", userController.login);

export default router;
