import { FastifyRequest, FastifyReply } from "fastify";

export const notificationsPush = (req: FastifyRequest, res: FastifyReply) => {
  return res.status(200).send({ message: "Valid /notification hit" });
};


export const registerNotificationToken = (req: FastifyRequest, res: FastifyReply) => {
    
    return res.status(200).send({ message: "Valid /notification hit" });
}