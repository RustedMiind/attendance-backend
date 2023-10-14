import express, { Request, Response } from "express";
import {
  createRole,
  updateRole,
  getAllRoles,
} from "@/controllers/roles-controller/RolesController";
import { checkpermission } from "@/middlewares/checkPermission";
import assignRoleFunction from "@/controllers/roles-controller/assignRole";

const router = express.Router();

router.post("/new", checkpermission("role", 2), createRole);
router.post("/update", checkpermission("role", 2), updateRole);
router.post("/assign", checkpermission("role", 2), assignRoleFunction);
router.get("/all", checkpermission("role", 1), getAllRoles);

export default router;
