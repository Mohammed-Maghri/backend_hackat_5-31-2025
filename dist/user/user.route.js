import { getUserData, getUser } from "./user.controller.js";
import { eventEndPoint } from "../events/events.contoller.js";
export const userRoutes = (fastify) => {
    //define user Routes
    fastify.route({
        method: "GET",
        url: "/getUser",
        handler: getUser,
    });
    fastify.route({
        method: "GET",
        url: "/me",
        // schema: {
        //   headers: {
        //     type: "object",
        //     properties: {
        //       Authorization: { type: "string" },
        //     },
        //     required: ["Authorization"],
        //   },
        // },
        handler: getUserData,
    });
    fastify.route({
        method: "GET",
        url: "/event",
        handler: eventEndPoint,
    });
};
