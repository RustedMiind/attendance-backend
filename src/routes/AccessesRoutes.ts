import { getAccessesNames } from "@/controllers/access-controller/AccessController";
import { checkAccess } from "@/middlewares/checkAccess";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/names", checkAccess("access", 1), getAccessesNames);

export default router;
