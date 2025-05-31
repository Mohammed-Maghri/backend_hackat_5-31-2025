import { FastifyRequest, FastifyReply } from "fastify";
import { eventTypes } from "../types/eventType";
import { Orm_db } from "../orm.js";
import { user_authData } from "../types/userAuthData";

export const eventCreation = async (
  req: FastifyRequest,
  resp: FastifyReply
) => {
  const eventData: eventTypes = req.body as eventTypes;
  console.log("The event Data is -------->", eventData);
  try {
    await req.jwtVerify();
    const user = (await req.jwtDecode()) as user_authData; // get user data from JWT
    const existingEvent = (await Orm_db.selection({
      server: req.server,
      table_name: "events",
      colums_name: ["id"],
      command_instraction: `WHERE title = '${eventData.title}' AND date = '${eventData.date}'`,
    })) as string[];
    if (existingEvent.length > 0) {
      return resp.badRequest(
        "Event with the same title and date already exists."
      );
    }
    const userId = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["id"],
      command_instraction: `WHERE login = '${user.login}'`,
    })) as number;
    console.log(userId, "userId of the user");
    const result = await Orm_db.insertion({
      server: req.server,
      table_name: "events",
      colums_name: [
        "title",
        "description",
        "location",
        "date",
        "image_url",
        "latitude",
        "longitude",
        "status",
        "category_id",
        "creator_id",
        "slots",
      ],
      colums_values: [
        eventData.title,
        eventData.description,
        eventData.location,
        eventData.date,
        eventData.image_url || "",
        eventData.latitude,
        eventData.longitude,
        eventData.status,
        eventData.category_id,
        userId,
        eventData.slots,
      ],
      command_instraction: null,
    });
    console.log("result of the insertion query", result);
    resp.status(200).send({ message: "/event endpoint hit" });
  } catch (e: any) {
    console.error("Error inserting event data:", e);
    resp.status(500).send({ error: "Failed to insert event data" });
    return;
  }
};
