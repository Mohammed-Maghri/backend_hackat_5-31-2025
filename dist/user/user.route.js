import { getUser } from "./user.controller.js";
export const userRoutes = (fastify) => {
    //define user Routes
    fastify.route({
        method: "GET",
        url: "/getUser",
        handler: getUser,
    });
};
