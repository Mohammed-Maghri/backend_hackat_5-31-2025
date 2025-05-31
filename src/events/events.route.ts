import { FastifyInstance } from "fastify";
import { eventCreation } from "./events.controller.js";
import {
  eventCreationSchema,
  eventParamsSchema,
  headerEventRegister,
  bodyEventRegister,
} from "./events.schema.js";
import zodToJsonSchema from "zod-to-json-schema";
import { eventEndPoint, eventRegister } from "./events.controller.js";

export const eventRoutes = (fastify: FastifyInstance) => {
  fastify.route({
    method: "POST",
    url: "/addEvent",
    schema: {
      body: zodToJsonSchema(eventCreationSchema),
    },
    handler: eventCreation,
  });
  fastify.route({
    method: "GET",
    url: "/event",
    schema: {
      querystring: zodToJsonSchema(eventParamsSchema),
    },
    handler: eventEndPoint,
  });
  fastify.route({
    method: "POST",
    url: "/event/register",
    schema: {
      headers: zodToJsonSchema(headerEventRegister),
      body: zodToJsonSchema(bodyEventRegister),
    },
    handler: eventRegister,
  });
};
