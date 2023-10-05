import jwt from "jsonwebtoken";

function jwtDecode(token: string) {
  const options = {};
  const decoded = jwt.decode(token, options);

  if (!decoded) return null;
  const payload = decoded;

  console.log(payload);

  jwt.verify(token, "asd" as string, (...res) => {
    console.log(res);
  });
}

export default jwtDecode;
