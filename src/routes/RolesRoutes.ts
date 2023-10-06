import express, { Request, Response } from "express";
import { createRole } from "@/controllers/roles-controller/RolesController";

const router = express.Router();

router.post("/new", createRole);

export default router;
