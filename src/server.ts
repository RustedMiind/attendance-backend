import express from "express";
import prisma from "@/prisma";
import validator from "validator";
import { Prisma } from "@prisma/client";
import userRouter from "@/routes/UserRoutes";

const app = express();

// Middlewares :
app.use(express.json());
if (prisma) {
  app.listen(3100);
  console.log(
    "||||||||||||  LISTENING ON http://localhost:3100/  ||||||||||||"
  );
} else {
  console.error("Cant Connect to db");
}

app.use("/user", userRouter);
