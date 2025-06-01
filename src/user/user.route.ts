import { FastifyInstance } from "fastify";
import { getUserData, healthCheck } from "./user.controller.js";
import { eventEndPoint } from "../events/events.controller.js";

export const userRoutes = (fastify: FastifyInstance) => {
  //define user Routes
  fastify.route({
    method: "GET",
    url: "/health-check",
    handler: healthCheck,
  });

  fastify.route({
    method: "GET",
    url: "/me",
    handler: getUserData,
  });
};
