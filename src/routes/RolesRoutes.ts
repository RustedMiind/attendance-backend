import express, { Request, Response } from "express";
import {
  createRole,
  updateRole,
  getAllRoles,
} from "@/controllers/roles-controller/RolesController";

const router = express.Router();

router.post("/new", createRole);
router.post("/update", updateRole);
router.get("/all", getAllRoles);

export default router;
