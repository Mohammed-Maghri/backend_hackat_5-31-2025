import { eventCreation } from "./events.controller.js";
import { eventCreationSchema, eventParamsSchema, headerEventRegister, bodyEventRegister, } from "./events.schema.js";
import zodToJsonSchema from "zod-to-json-schema";
import { eventEndPoint, eventRegister, eventUnregister, adminListUnverifiedEvents, adminEventVerify, eventAllCategories, eventAllRegistered, eventEndPointRegisterChecker, eventFavoriteList, eventAddToFavorite, eventDeleteFromFavorite, IntraEventGetter, } from "./events.controller.js";
export const eventRoutes = (fastify) => {
    //getting all the categories of the events
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
    //get all the events in the db
    fastify.route({
        method: "GET",
        url: "/event",
        schema: {
            querystring: zodToJsonSchema(eventParamsSchema),
        },
        handler: eventEndPoint,
    });
    //register to a specific event
    fastify.route({
        method: "POST",
        url: "/event/register",
        schema: {
            headers: zodToJsonSchema(headerEventRegister),
            body: zodToJsonSchema(bodyEventRegister),
        },
        handler: eventRegister,
    });
    //unregister to a specific event
    fastify.route({
        method: "POST",
        url: "/event/unregister",
        schema: {
            headers: zodToJsonSchema(headerEventRegister),
            body: zodToJsonSchema(bodyEventRegister),
        },
        handler: eventUnregister,
    });
    // return the unverified events only to the admin
    fastify.route({
        method: "GET",
        url: "/event/admin/unverifiedevents",
        handler: adminListUnverifiedEvents,
    });
    // lets the admin verify the specific unverified event
    fastify.route({
        method: "POST",
        url: "/event/admin/modify",
        schema: {
            headers: zodToJsonSchema(headerEventRegister),
            body: zodToJsonSchema(bodyEventRegister),
        },
        handler: adminEventVerify,
    });
    // return all the registered events of a user
    fastify.route({
        method: "GET",
        url: "/event/user/registeredevents",
        handler: eventAllRegistered,
    });
    // he will pass the event id and return if registered or not
    fastify.route({
        method: "GET",
        url: "/event/user/:id",
        handler: eventEndPointRegisterChecker,
    });
    fastify.route({
        method: "GET",
        url: "/event/list/favorite",
        schema: {
            headers: zodToJsonSchema(headerEventRegister),
        },
        handler: eventFavoriteList,
    });
    fastify.route({
        method: "POST",
        url: "/event/add/favorite",
        schema: {
            headers: zodToJsonSchema(headerEventRegister),
            body: zodToJsonSchema(bodyEventRegister),
        },
        handler: eventAddToFavorite,
    });
    fastify.route({
        method: "POST",
        url: "/event/delete/favorite",
        schema: {
            headers: zodToJsonSchema(headerEventRegister),
            body: zodToJsonSchema(bodyEventRegister),
        },
        handler: eventDeleteFromFavorite,
    });
    fastify.route({
        method: "GET",
        url: "/event/intra",
        handler: IntraEventGetter,
    });
};
