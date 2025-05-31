import { FastifyInstance } from "fastify";
import { url } from "../controllers/srr_auth.js";

export const redirect_url =  (instance: FastifyInstance) => {
  instance.route({
    method: "GET",
    url: "/redirect",
    // schema: {
    //   querystring: {
    //     type: "object",
    //     properties: {
    //       code: { type: "string" },
    //     },
    //     required: ["code"],
    //   },
    // },
    handler: url,
  });
};
