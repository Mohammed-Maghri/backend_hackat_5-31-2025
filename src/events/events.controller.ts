import { FastifyRequest, FastifyReply } from "fastify";
import { eventTypes } from "../types/eventType.js";
import { Orm_db } from "../orm.js";
import { queryObject } from "../types/queryType.js";
import { user_authData } from "../types/userAuthData.js";
import { shouldSearch } from "../helpers/searchParser.js";

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
    })) as number | [];
    if ((userId as []).length === 0) {
      console.log("No existing user");
      return resp.badRequest("User not found");
    }
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
        userId as number,
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

export const eventEndPoint = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    console.log("testing api call");
    const geterOject = req.query as queryObject;
    const queryFilter: queryObject = {
      title: (geterOject.title as string) || "",
      category_id: (geterOject.category_id as string) || "",
      start_date: (geterOject.start_date as string) || "",
      end_date: (geterOject.end_date as string) || "",
      page: (geterOject.page as string) || "",
    };
    return res.status(200).send({
      events: await Orm_db.selection({
        server: req.server,
        table_name: "events",
        colums_name: ["*"],
        command_instraction: shouldSearch(queryFilter),
      }),
    });
  } catch (e) {
    return res.status(400).send({ status: "Error !" });
  }
};
