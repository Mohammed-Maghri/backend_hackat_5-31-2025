import { FastifyInstance } from "fastify";
import { eventCreation } from "./events.controller.js";
import { eventCreationSchema, eventParamsSchema } from "./events.schema.js";
import zodToJsonSchema from "zod-to-json-schema";
import { eventEndPoint , eventRegister} from "./events.controller.js";
import { required } from "zod/v4-mini";

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
    schema : {
      querystring : zodToJsonSchema(eventParamsSchema),
    },
    handler: eventEndPoint,
  });
  fastify.route({
    method: "POST",
    url: "/event/register",
    schema : {
      headers : {
        type : "object",
        properties : {
          Authorization : { type: "string" }
        },
        required : ["Authorization"]
      },
      body : {
        type : "object",
        properties : {
          eventId : { type: "string" }
        },
        required : ["eventId"]
      }
    },
    handler : eventRegister
  });
};
