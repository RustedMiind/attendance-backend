import prisma from "@/prisma";
import { jwtCreate } from "@/functions/jwtCreate";

async function token(userId: string, type: "update" | "new" = "new") {
  let userToken;
  switch (type) {
    case "new":
      userToken = await prisma.userToken.create({
        data: {
          userId: userId,
        },
        select: { user: true, id: true },
      });
      break;
    case "update":
      await prisma.userToken.delete({
        where: {
          userId,
        },

        select: { user: true },
      });
      userToken = await prisma.userToken
        .create({
          data: {
            userId: userId,
          },
          select: { user: true, id: true },
        })
        .catch((err) => {
          return err;
        });

      break;
  }

  const token = jwtCreate({ id: userToken.id });

  const { password, ...noPassword } = userToken.user;
  return { token, user: noPassword };
}

export { token };
