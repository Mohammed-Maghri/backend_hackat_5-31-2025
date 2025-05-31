import { FastifyRequest, FastifyReply } from "fastify";
import { Orm_db } from "../orm.js";
import { userDatabaseSchema, user_authData } from "../types/userAuthData";

// work on the privileges of the admin, test with valid admin user, and test the endpoint
export const addAdminPriveleges = async (
  req: FastifyRequest<{ Querystring: { login: string } }>,
  res: FastifyReply
) => {
  try {
    await req.jwtVerify();
    const user = (await req.jwtDecode()) as user_authData;
    const isPriviliged = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["*"],
      command_instraction: `WHERE login = "${user.login}"`,
    })) as userDatabaseSchema[];
    console.log(isPriviliged);
    if (isPriviliged.length === 0) {
      console.log("User not found in database");
      if (!user.staff) {
        return res.status(403).send({ logs: "Forbidden" });
      }
    } else if (!isPriviliged[0].staff) {
      console.log("User is not an admin");
      return res.status(403).send({ logs: "Forbidden" });
    }
    const { login } = req.query;
    if (!login) {
      return res.status(400).send({ error: "Login is required" });
    }
    console.log("Adding admin privileges for user:", login);
    const userSelection = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["*"],
      command_instraction: `WHERE login = "${login}"`,
    })) as userDatabaseSchema[];
    console.log("User Selection:", userSelection);
    if (userSelection.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    const userId = userSelection[0].id;
    if (userSelection[0].staff) {
      return res.status(400).send({ error: "User is already an admin" });
    }
    const getUserId = await Orm_db.update({
      server: req.server,
      table_name: "users",
      colums_name: ["role"],
      colums_values: [true],
      condition: `WHERE id = "${userId}"`,
    });
    return res
      .status(200)
      .send({ logs: "Admin privileges added successfully" });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).send({ error: "Unauthorized" });
  }
};
