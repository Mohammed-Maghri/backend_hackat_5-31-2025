import { FastifyRequest, FastifyReply } from "fastify";
import { user_authData } from "../controllers/auth_intra";
import { userAccountCreation } from "../utils/userCreation.js";


export const getUser = (req: FastifyRequest, resp: FastifyReply) => {
  console.log("Request valid");
  resp.forbidden();
};

export const getUserData = async (req: FastifyRequest, resp: FastifyReply) => {
  try {
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();
    const result = await userAccountCreation(req, userData);
    return resp.status(200).send(userData);
  } catch (e) {
    console.log(" ----<> catched Error", e);
    return resp.badRequest("Invalid User !");
  }
};
