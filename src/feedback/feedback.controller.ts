import { FastifyRequest, FastifyReply } from "fastify";
import { user_authData } from "../types/userAuthData";

export const addFeedback = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  await request.jwtVerify();
  const userData: user_authData = await request.jwtDecode(); // extract the login

  console.log(userData, "decoded version of the user printed data");
  reply.send({ message: "endpoint Hit" });
};
