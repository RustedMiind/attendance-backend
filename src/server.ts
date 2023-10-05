import "module-alias/register";
import express from "express";
import userRouter from "@/routes/UserRoutes";
import prisma from "@/prisma";

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