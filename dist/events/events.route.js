import { eventCreation } from "./events.controller.js";
import { eventCreationSchema, eventParamsSchema } from "./events.schema.js";
import zodToJsonSchema from "zod-to-json-schema";
import { eventEndPoint } from "./events.controller.js";
export const eventRoutes = (fastify) => {
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
            params: zodToJsonSchema(eventParamsSchema),
        },
        handler: eventEndPoint,
    });
};
