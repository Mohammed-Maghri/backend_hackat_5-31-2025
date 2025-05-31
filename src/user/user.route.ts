import { FastifyInstance } from "fastify";
import { getUserData, getUser } from "./user.controller.js";

export const userRoutes = (fastify: FastifyInstance) => {
  //define user Routes
  fastify.route({
    method: "GET",
    url: "/getUser",
    handler: getUser,
  });
  
  fastify.route({
    method: "GET",
    url: "/me",
    // schema: {
    //   headers: {
    //     type: "object",
    //     properties: {
    //       Authorization: { type: "string" },
    //     },
    //     required: ["Authorization"],
    //   },
    // },
    handler: getUserData,
  });
};
