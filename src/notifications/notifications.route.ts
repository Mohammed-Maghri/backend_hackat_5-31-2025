import { FastifyInstance } from "fastify/types/instance";
import { notificationZodObject } from "./notifications.schema";
import { notificationsPush,registerNotificationToken } from "./notifications.controller";

export const notificationsRoute = (fastify: FastifyInstance) => {
  fastify.route({
    method: "POST",
    url: "/notifs/send-notification",
    schema: {
      body: notificationZodObject,
    },
    handler: notificationsPush,
  });
  fastify.route({
    method: "GET",
    url: "/notifs/register-token",
    handler: registerNotificationToken,
  });
};
