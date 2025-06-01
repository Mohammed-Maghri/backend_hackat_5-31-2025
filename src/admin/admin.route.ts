import { FastifyInstance } from "fastify";
import { addAdminPriveleges, addEventCategory } from "./admin.controller.js";
import zodToJsonSchema from "zod-to-json-schema";
import { categoryAddSchema } from "./admin.schema.js";


export const adminRoutes = (fastify: FastifyInstance) => {
  fastify.route({
    method: "GET",
    url: "/admin/addPriveleges",
    handler: addAdminPriveleges,
  });

  fastify.route({
    method: "POST",
    url: "/admin/addCategory",
    schema: {
      body: zodToJsonSchema(categoryAddSchema),
    },
    handler: addEventCategory,
  });
};
