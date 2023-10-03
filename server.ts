import express from "express";
import prisma from "./prisma";

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

app.get("/", (req, res) => {
  const user = prisma.user
    .create({
      data: {
        name: "Ali Soliman",
        email: "hello21",
      },
    })
    .then((user) => {
      console.log(user);
    })
    .catch(console.log);
});
