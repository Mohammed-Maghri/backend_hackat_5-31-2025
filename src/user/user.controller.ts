import { FastifyRequest, FastifyReply } from "fastify";
import { user_authData } from "../controllers/auth_intra";

export const getUser = (req: FastifyRequest, resp: FastifyReply) => {
  console.log("Request valid");
  resp.forbidden();
};

export const getUserData = async (req: FastifyRequest, resp: FastifyReply) => {
  try {
    console.log(' -----< ' , req.headers)
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();
    return resp.status(200).send(userData);
  } catch (e) {
    console.log(" ----<> catched Error", e);
    return resp.badRequest("Invalid User !");
  }
};
