import { FastifyRequest, FastifyReply } from "fastify";
import { user_authData } from "../types/userAuthData";
import { feedbackSchemaType } from "./feedback.schema";
import { Orm_db } from "../orm.js";
import { Params } from "zod/v4/core";

// function check if the event exists, if so ,checks if the user has already feedbacked the event, if not, inserts the feedback
export const addFeedback = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  await request.jwtVerify();
  const userData: user_authData = await request.jwtDecode(); // extract the login of the user
  const userId = userData.id;
  const body = request.body as feedbackSchemaType;
  // checking event presence in the db
  const checkEventPresence = (await Orm_db.selection({
    server: request.server,
    table_name: "events",
    colums_name: ["id"],
    command_instraction: `WHERE id = "${body.event_id}"`,
  })) as number[];
  if (checkEventPresence.length === 0) {
    return reply.badRequest("Event not found");
  }
  //checking if the user has already feedbacked the event
  const result = (await Orm_db.selection({
    server: request.server,
    table_name: "feedback",
    colums_name: ["user_id", "event_id"],
    command_instraction: `WHERE user_id = "${userId}" AND event_id = "${body.event_id}"`,
  })) as string[];
  if (result.length !== 0) {
    return reply
      .status(400)
      .send({ message: "User has already feedbacked the event" });
  }
  // should insert the feedback
  const insertingUserFeedback = (await Orm_db.insertion({
    server: request.server,
    table_name: "feedback",
    colums_name: ["user_id", "event_id", "rating", "comment"],
    colums_values: [userId, body.event_id, body.rating, body.comment],
    command_instraction: null,
  })) as unknown | number;
  if (insertingUserFeedback === -1) {
    return reply
      .status(400)
      .send({ message: "An error occurred while inserting feedback" });
  }
  // if the insertion is successful, return a success message
  reply.send({ message: "endpoint Hit" });
};

// function to get the feedback of a user, if the user has feedbacked any event, return the feedbacks
export const getFeedback = async (req: FastifyRequest, resp: FastifyReply) => {
  await req.jwtVerify();
  const userData: user_authData = await req.jwtDecode(); // extract the login of the user
  const userId = userData.id;
  // checking if the user has feedbacked any event
  const result = (await Orm_db.selection({
    server: req.server,
    table_name: "feedback",
    colums_name: ["user_id", "event_id", "rating", "comment"],
    command_instraction: `WHERE user_id = "${userId}"`,
  })) as {
    user_id: number;
    event_id: number;
    rating: number;
    comment: string;
  }[];
  if (result.length === 0) {
    return resp
      .status(404)
      .send({ message: "No feedback found for this user" });
  }
  // if the user has feedbacked, return the feedbacks
  resp.send(result);
};

export const getFeedbackByEventId = async (
  req: FastifyRequest<{ Params: { event_id: string } }>,
  reply: FastifyReply
) => {
  const eventId = req.params.event_id;
  await req.jwtVerify();
  const userData: user_authData = await req.jwtDecode(); // extract the login of the user
  const userId = userData.id;
  // checking if the event exists
  const checkEventPresence = (await Orm_db.selection({
    server: req.server,
    table_name: "events",
    colums_name: ["id"],
    command_instraction: `WHERE id = "${eventId}"`,
  })) as number[];

  if (checkEventPresence.length === 0) {
    return reply.status(400).send({ message: "Event not found" });
  }
  // if the event exists, get the feedbacks
  const eventFeedbacks = (await Orm_db.selection({
    server: req.server,
    table_name: "feedback",
    colums_name: ["user_id", "event_id", "rating", "comment"],
    command_instraction: `WHERE event_id = "${eventId}"`,
  })) as string[];

  if (eventFeedbacks.length !== 0) {
    return reply.send(eventFeedbacks);
  } else {
    return reply
      .status(200)
      .send({ message: "No feedbacks found for this event" });
  }
};
