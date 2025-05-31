import { FastifyInstance } from "fastify";
import { getUser } from "./user.controller.js";

export const userRoutes = (fastify: FastifyInstance) => {
    //define user Routes
  fastify.route({
    method: "GET",
    url: "/getUser",
    handler: getUser,
  });
};
