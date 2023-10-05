import jwt from "jsonwebtoken";

const DAY = 1000 * 60 * 60 * 24;
function jwtCreate(id: { id: string | number }) {
  let token = jwt.sign(id, process.env.SECRET_KEY as string, {
    expiresIn: "2 days",
  });

  console.log(token);
  return token;
}
export { jwtCreate };
