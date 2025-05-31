import { FastifyInstance } from "fastify";
import { addFeedback } from "./feedback.controller.js";
import zodToJsonSchema from "zod-to-json-schema";
import { feedbackSchema } from "./feedback.schema.js";

export const feedBackroutes = (fastify: FastifyInstance) => {
  fastify.route({
    method: "POST",
    url: "/feedback",
    schema: {
      body: zodToJsonSchema(feedbackSchema),
    },
    handler: addFeedback,
  });
};
