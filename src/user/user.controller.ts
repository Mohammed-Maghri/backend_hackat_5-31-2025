import { FastifyRequest, FastifyReply } from "fastify";
import { user_authData } from "../controllers/auth_intra";
import { Orm_db } from "../orm.js";

export const healthCheck = async (req: FastifyRequest, resp: FastifyReply) => {
  try {
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();
    console.log("valid endpoint hit , backend is UP");
    console.log(req.raw.url, " query params in health check");
    const {expo_notification_token} = req.query as {expo_notification_token : string};
    console.log(expo_notification_token);
    if (expo_notification_token) {
      console.log("Expo notification token:", expo_notification_token);
      const resu = await Orm_db.update({
        server: req.server,
        table_name: "users",
        colums_name: ["expo_notification_token"],
        colums_values: [expo_notification_token],
        condition: `where login = '${userData.login}'`,
      });
    }
    return resp.status(200).send({ message: "Valid /healthCheck hit" });
  } catch (err) {
    return resp.status(404).send({ error: "Not found" });
  }
};

export const getUserData = async (
  req: FastifyRequest<{ Body: { expo_notification_token: string } }>,
  resp: FastifyReply
) => {
  try {
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();
    // check if the user is in database
    const userCheck = await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["*"],
      command_instraction: `where login = '${userData.login}'`,
    }) as user_authData[];
    if (userCheck.length === 0) {
      return resp.status(404).send({ error: "User not found" });
    }
    // This function returns the Data of the user
    return resp.status(200).send(userCheck);
  } catch (e) {
    console.log(" ----<> catched Error", e);
    return resp.badRequest("Invalid User !");
  }
};
