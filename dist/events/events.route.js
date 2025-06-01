import { eventCreation } from "./events.controller.js";
import { eventCreationSchema, eventParamsSchema, headerEventRegister, bodyEventRegister, } from "./events.schema.js";
import zodToJsonSchema from "zod-to-json-schema";
import { eventEndPoint, eventRegister, eventUnregister, adminListUnverifiedEvents, adminEventVerify, eventAllCategories, } from "./events.controller.js";
export const eventRoutes = (fastify) => {
    fastify.route({
        method: "GET",
        url: "/event/categories",
        handler: eventAllCategories,
    });
    // creating an event
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
    fastify.route({
        method: "POST",
        url: "/event/unregister",
        schema: {
            headers: zodToJsonSchema(headerEventRegister),
            body: zodToJsonSchema(bodyEventRegister),
        },
        handler: eventUnregister,
    });
    fastify.route({
        method: "GET",
        url: "/event/admin/unverifiedevents",
        handler: adminListUnverifiedEvents,
    });
    fastify.route({
        method: "POST",
        url: "/event/admin/modify",
        schema: {
            headers: zodToJsonSchema(headerEventRegister),
            body: zodToJsonSchema(bodyEventRegister),
        },
        handler: adminEventVerify,
    });
};
