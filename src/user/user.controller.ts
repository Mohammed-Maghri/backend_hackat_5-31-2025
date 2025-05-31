import { FastifyRequest, FastifyReply } from "fastify";

export const getUser = (req: FastifyRequest, resp: FastifyReply) => {
  console.log("Request valid");
  resp.forbidden();
};
