import prisma from "@/prisma";

async function createToken(userId: string) {
  const userToken = await prisma.userToken.create({
    data: {
      userId,
    },
    include: {
      user: true,
    },
  });
  return userToken;
}
async function updateToken(userId: string) {
  const userToken = await prisma.userToken.update({
    where: {
      userId,
    },
    data: {
      userId,
    },
    include: {
      user: true,
    },
  });
  return userToken;
}

export { createToken, updateToken };
