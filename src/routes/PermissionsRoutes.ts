import * as controller from "@/controllers/permission-controller/PermissionController";
import { checkpermission } from "@/middlewares/checkPermission";
import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  "/names",
  checkpermission("permission", 1),
  controller.getpermissionsNames
);
router.get(
  "/lte",
  checkpermission("permission", 1),
  controller.getPermissionsUserCanGive
);

export default router;
