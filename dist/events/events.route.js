import { eventCreation } from "./events.controller.js";
import { eventCreationSchema } from "./events.schema.js";
import zodToJsonSchema from "zod-to-json-schema";
export const eventRoutes = (fastify) => {
    fastify.route({
        method: "POST",
        url: "/addEvent",
        schema: {
            body: zodToJsonSchema(eventCreationSchema),
        },
        handler: eventCreation,
    });
};
