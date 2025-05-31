import { FastifyInstance } from "fastify";
import {
  addFeedback,
  getFeedback,
  getFeedbackByEventId,
} from "./feedback.controller.js";
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
  fastify.route({
    method: "GET",
    url: "/feedback",
    handler: getFeedback,
  });
  fastify.route({
    method: "GET",
    url: "/feedback/:event_id",
    handler: getFeedbackByEventId,
  });
};
