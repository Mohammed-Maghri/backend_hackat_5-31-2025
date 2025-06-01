import { FastifyRequest, FastifyReply } from "fastify";
import { user_authData } from "../controllers/auth_intra";

export const healthCheck = (req: FastifyRequest, resp: FastifyReply) => {
  resp.status(200).send({ message: "Valid /healthCheck hit" });
};

export const getUserData = async (
  req: FastifyRequest<{ Body: { expo_notification_token: string } }>,
  resp: FastifyReply
) => {
  try {
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();
    return resp.status(200).send(userData);
  } catch (e) {
    console.log(" ----<> catched Error", e);
    return resp.badRequest("Invalid User !");
  }
};
