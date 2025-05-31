import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
export default fp(async (fastify) => {
    fastify.register(fastifyJwt, {
        secret: "7f472a49a80005a0493cc4c4fd0fc431ee072191595abe709026047ceb886d3c",
    });
});
