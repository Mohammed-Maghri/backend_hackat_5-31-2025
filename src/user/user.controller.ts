import { FastifyRequest, FastifyReply } from "fastify";
import { user_authData } from "../controllers/auth_intra";
import { userAccountCreation } from "../utils/userCreation.js";

export const healthCheck = async (req: FastifyRequest, resp: FastifyReply) => {
  try {
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();
    console.log("valid endpoint hit , backend is UP");
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
    // This function returns the Data of the user
    return resp.status(200).send(userData);
  } catch (e) {
    console.log(" ----<> catched Error", e);
    return resp.badRequest("Invalid User !");
  }
};
