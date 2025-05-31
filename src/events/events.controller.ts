import { FastifyRequest, FastifyReply } from "fastify";
import { eventTypes } from "../types/eventType";

export const eventCreation = async (
  req: FastifyRequest,
  resp: FastifyReply
) => {
  const eventData: eventTypes = req.body as eventTypes;
  console.log("The event Data is -------->", eventData);
  console.log("Creation of the route ");

  resp.status(200).send({ message: "/event endpoint hit" });
};
