import { FastifyRequest, FastifyReply } from "fastify";
import { eventTypes, registerEventTypes,  } from "../types/eventType.js";
import { Orm_db } from "../orm.js";
import { queryObject } from "../types/queryType.js";
import { user_authData } from "../types/userAuthData.js";
import { shouldSearch } from "../helpers/searchParser.js";

interface eventQueryVerify {
  slots: number | undefined;
  status: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
};

export const eventCreation = async (
  req: FastifyRequest,
  resp: FastifyReply
) => {
  const eventData: eventTypes = req.body as eventTypes;
  try {
    await req.jwtVerify();
    const user = (await req.jwtDecode()) as user_authData;
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

export const eventRegister = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    await req.jwtVerify();
    const user: user_authData = (await req.jwtDecode()) as user_authData; // get user data from JWT
    const eventInfos: registerEventTypes = req.body as registerEventTypes;
    const CheckingError: unknown = await Orm_db.insertion({
      server: req.server,
      table_name: "registrations",
      colums_name: ["user_id", "event_id"],
      colums_values: [user.id, eventInfos.eventId.toString()],
      command_instraction: null,
    });
    if (CheckingError === -1) {
      return res.status(400).send({ error: "Registration failed" });
    }
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).send({ error: "Unauthorized" });
  }
  res.status(200).send({ logs: "eventRegister endpoint hit !" });
};

export const eventUnregister  = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    await req.jwtVerify();
    const user: user_authData = (await req.jwtDecode()) as user_authData;
    const eventInfos: registerEventTypes = req.body as registerEventTypes;
    const CheckingError: unknown = await Orm_db.deletion({
      server: req.server,
      table_name: "registrations",
      condition: `WHERE user_id = "${user.id}" AND event_id = "${eventInfos.eventId}"`,
    });
    if (CheckingError === -1) {
      return res.status(400).send({ error: "Registration deletion failed" });
    }
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).send({ error: "Unauthorized" });
  }
  res.status(200).send({ logs: "eventDelete endpoint hit !" });
};

export const adminEventVerify = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    await req.jwtVerify();
    const user: user_authData = (await req.jwtDecode()) as user_authData;
    if (!user.staff) return res.status(403).send({ logs: "Forbidden" });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).send({ error: "Unauthorized" });
  }
};

export const adminListUnverifiedEvents = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    await req.jwtVerify();
    const user: user_authData = (await req.jwtDecode()) as user_authData;
    // if (!user.staff) return res.status(403).send({ logs: "Forbidden" });
    const unverifiedEvents = await Orm_db.selection({
      server: req.server,
      table_name: "events",
      colums_name: ["*"],
      command_instraction: "WHERE status = 'pending'",
    });
    return res.status(200).send({ events: unverifiedEvents });
  } catch (err) {
    console.error("Error fetching unverified events:", err);
    return res.status(500).send({ error: "Failed to fetch unverified events" });
  }
};
