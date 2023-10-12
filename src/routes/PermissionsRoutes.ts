import { getpermissionsNames } from "@/controllers/permission-controller/PermissionController";
import { checkpermission } from "@/middlewares/checkPermission";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/names", checkpermission("permission", 1), getpermissionsNames);

export default router;
