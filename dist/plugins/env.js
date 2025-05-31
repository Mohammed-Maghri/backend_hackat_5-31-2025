import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";
export const envPlugin = fp(async (fastify) => {
    const schema = {
        type: "object",
        required: [
            "intra_point",
            "encryption_key",
            "redirect_uri",
            "client_id",
            "port",
            "intra_secret",
            "intra_endpoint",
            "backend_endpoint",
        ],
        properties: {
            backend_endpoint: {
                type: "string",
                default: "https://0cd6-197-230-30-146.ngrok-free.app",
            },
            port: {
                type: "number",
                default: 8080,
            },
            client_id: {
                type: "string",
                default: "u-s4t2ud-3acb9e44a10c8a45fbf13db9bd51295f24224bf9fc7cec6890ed26e1715330a3",
            },
            redirect_uri: {
                type: "string",
                default: "https://0cd6-197-230-30-146.ngrok-free.app/redirect",
            },
            intra_endpoint: {
                type: "string",
                default: "https://api.intra.42.fr/oauth/token",
            },
            intra_secret: {
                type: "string",
                default: "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",
            },
            intra_point: {
                type: "string",
                default: "https://api.intra.42.fr",
            },
            encryption_key: {
                type: "string",
                default: "7f472a49a80005a0493cc4c4fd0fc431ee072191595abe709026047ceb886d3c",
            },
        },
    };
    await fastify.register(fastifyEnv, {
        schema,
        data: process.env,
    });
});
