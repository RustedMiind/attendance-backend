import * as dotenv from "dotenv";
dotenv.config();
import "module-alias/register";
import express from "express";
import UserRoutes from "@/routes/UserRoutes";
import RoleRoutes from "@/routes/RolesRoutes";
import AccessesRoutes from "@/routes/AccessesRoutes";
import prisma from "@/prisma";
import cors from "cors";

const app = express();

app.use(
  cors({
    preflightContinue: true,
    origin: ["http://192.168.1.9:3000", "http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  })
);

// Middlewares :
app.use(express.json());
if (prisma) {
  app.listen(process.env.PORT);
  console.log(
    "||||||||||||  LISTENING ON http://localhost:3100/  ||||||||||||"
  );
} else {
  console.error("Cant Connect to db");
}

app.use("/user", UserRoutes);
app.use("/role", RoleRoutes);
app.use("/access", AccessesRoutes);
