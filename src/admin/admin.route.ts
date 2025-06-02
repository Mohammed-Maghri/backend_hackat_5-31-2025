import { FastifyInstance } from "fastify";
import {
  addAdminPriveleges,
  addEventCategory,
  deleteEvent,
  endEvent,
  updateEvent,
} from "./admin.controller.js";
import zodToJsonSchema from "zod-to-json-schema";
import { categoryAddSchema, eventUpdateSchema } from "./admin.schema.js";

export const adminRoutes = (fastify: FastifyInstance) => {
  fastify.route({
    method: "GET",
    url: "/admin/addPriveleges",
    handler: addAdminPriveleges,
  });

  fastify.route({
    method: "GET",
    url: "/admin/addCategory",
    schema: {
      querystring: zodToJsonSchema(categoryAddSchema),
    },
    handler: addEventCategory,
  });
  // remove category
  fastify.route({
    method: "GET",
    url: "/admin/removeCategory",
    schema: {
      querystring: zodToJsonSchema(categoryAddSchema),
    },
    handler: addEventCategory,
  }); // Assuming you have a handler for removing categories

  fastify.route({
    method: "DELETE",
    url: "/admin/event/:id",
    handler: deleteEvent,
  });

  fastify.route({
    method: "GET",
    url: "/admin/event/endevent/:id",
    handler: endEvent,
  });

  // update event section in post request
  fastify.route({
    method: "PUT",
    url: "/admin/event/:id",
    schema: {
      body: zodToJsonSchema(eventUpdateSchema),
    },
    handler: updateEvent,
  });
};
