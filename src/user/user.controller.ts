import { FastifyRequest, FastifyReply } from "fastify";
import { user_authData } from "../controllers/auth_intra";
import { userAccountCreation } from "../utils/userCreation.js";

export const getUser = (req: FastifyRequest, resp: FastifyReply) => {
  console.log("valid endpoint hit , backend is UP");
  resp.status(200).send({ message: "Valid /user hit" });
};

export const getUserData = async (req: FastifyRequest<{Body : {expo_notification_token : string}}>, resp: FastifyReply) => {
  try {
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();
    await userAccountCreation(req, userData);
    return resp.status(200).send(userData);
  } catch (e) {
    console.log(" ----<> catched Error", e);
    return resp.badRequest("Invalid User !");
  }
};
