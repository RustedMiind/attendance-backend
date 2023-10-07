import express, { Request, Response } from "express";
import {
  createRole,
  updateRole,
} from "@/controllers/roles-controller/RolesController";

const router = express.Router();

router.post("/new", createRole);
router.post("/update", updateRole);

export default router;
