import express, { Request, Response } from "express";
import {
  createRole,
  updateRole,
  getAllRoles,
} from "@/controllers/roles-controller/RolesController";
import { checkAccess } from "@/middlewares/checkAccess";

const router = express.Router();

router.post("/new", checkAccess("role", 2), createRole);
router.post("/update", checkAccess("role", 2), updateRole);
router.get("/all", checkAccess("role", 1), getAllRoles);

export default router;
