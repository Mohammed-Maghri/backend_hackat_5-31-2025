import { FastifyInstance } from "fastify";
import { addAdminPriveleges, addEventCategory } from "./admin.controller.js";

export const adminRoutes = (fastify: FastifyInstance) => {
  fastify.route({
    method: "GET",
    url: "/admin/addPriveleges",
    handler: addAdminPriveleges,
  });

  fastify.route({
    method: "POST",
    url: "/admin/addCategory",
    handler: addEventCategory,
  });
};
