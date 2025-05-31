import { FastifyInstance } from "fastify";
import { addAdminPriveleges } from "./admin.controller.js";

export const adminRoutes = (fastify: FastifyInstance) => {
  fastify.route({
    method: "GET",
    url: "/admin/addPriveleges",
    handler: addAdminPriveleges,
  });
};
