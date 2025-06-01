import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { eventTypes, registerEventTypes } from "../types/eventType.js";
import { Orm_db } from "../orm.js";
import {
  queryObject,
  eventQueryVerify,
  objectReturnAdminUpdate,
} from "../types/queryType.js";
import { user_authData } from "../types/userAuthData.js";
import { shouldSearch } from "../helpers/searchParser.js";
import { userDatabaseSchema } from "../types/userAuthData.js";
import { eventBody } from "../types/queryType.js";
import { sendPushNotification } from "../utils/notificationSender.js";

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
    const userDbData = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["*"],
      command_instraction: `WHERE login = '${user.login}'`,
    })) as userDatabaseSchema[];
    console.log(userDbData, "User data fetched from DB");
    if (userDbData.length === 0) {
      console.log("No existing user");
      return resp.badRequest("User not found");
    }

    let status = "pending";
    if (userDbData[0].club_staff || user.staff) {
      status = "upcoming";
    }
    console.log(userDbData);
    // should get category name to push to db
    const categoryData = (await Orm_db.selection({
      server: req.server,
      table_name: "categories",
      colums_name: ["category_name"],
      command_instraction: `WHERE id = '${eventData.category_id}'`,
    })) as { category_name: string }[];
    if (categoryData.length === 0) {
      return resp.badRequest("Category not found");
    }
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
        "category_name",
      ],
      colums_values: [
        eventData.title,
        eventData.description,
        eventData.location,
        eventData.date,
        eventData.image_url || "",
        eventData.latitude,
        eventData.longitude,
        status,
        eventData.category_id,
        userDbData[0].id,
        eventData.slots,
        categoryData[0].category_name,
      ],
      command_instraction: null,
    });
    if (result === -1) {
      return resp.status(400).send({ error: "Failed to insert event data" });
    }
    console.log("Event data inserted successfully");
    // send notifications to all users when event is created
    const userTokens = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["expo_notification_token"],
      command_instraction: null,
    })) as string[];
    
    console.log(userTokens, "Tokens ------------------------");
    if (userTokens.length > 0) {
      for (const token of userTokens) {
        console.log("Sending notification to token:", token);
        await sendPushNotification(token, eventData);
      }
    }
    resp.status(200).send({ message: "/event endpoint hit" });
  } catch (e: any) {
    console.error("event Creation Failed");
    resp.status(400).send({ error: "Failed to insert event data" });
    return;
  }
};

const queryGetEventsWithAvatarPic = async (
  queryFilter: queryObject,
  server: FastifyInstance
) => {
  try {
    const search = shouldSearch(queryFilter);
    let query = "";
    if (search != null) {
      query = `SELECT events.*, users.images, users.login FROM events
    JOIN users ON events.creator_id = users.id ${search}`;
    } else {
      query = `SELECT events.*, users.images , users.login FROM events
    JOIN users ON events.creator_id = users.id`;
    }
    const searchResult = await server.db.all(query);
    return searchResult;
  } catch (error) {
    throw new Error("Error fetching events with avatar pictures");
  }
};

export const eventEndPoint = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const geterOject = req.query as queryObject;
    const queryFilter: queryObject = {
      title: (geterOject.title as string) || "",
      category_id: (geterOject.category_id as string) || "",
      start_date: (geterOject.start_date as string) || "",
      end_date: (geterOject.end_date as string) || "",
      page: (geterOject.page as string) || "",
    };
    const events = await queryGetEventsWithAvatarPic(queryFilter, req.server);
    return res.status(200).send(events);
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

export const eventUnregister = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
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

const eventQueryVerify = (eventInfo: eventQueryVerify) => {
  let colums_append_array: string[] = [];
  let colums_values_append_array: string[] = [];
  if (eventInfo.status !== "") {
    colums_append_array = [...colums_append_array, "status"];
    colums_values_append_array.push(eventInfo.status);
  }
  if (eventInfo.slots !== "") {
    colums_append_array = [...colums_append_array, "slots"];
    colums_values_append_array.push(eventInfo.slots.toString());
  }
  if (eventInfo.latitude !== "") {
    colums_append_array = [...colums_append_array, "latitude"];
    colums_values_append_array.push(eventInfo.latitude.toString());
  }
  if (eventInfo.longitude !== "") {
    colums_append_array = [...colums_append_array, "longitude"];
    colums_values_append_array.push(eventInfo.longitude.toString());
  }
  if (colums_append_array.length > 0) {
    return {
      columns_name: colums_append_array,
      columns_values: colums_values_append_array,
    } as objectReturnAdminUpdate;
  } else return null;
};

// Tomorrow, we will implement the adminEventVerify function
// Everythin is ready, we just need to implement the query and Insert it with the orm_db
// and the response

export const adminEventVerify = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    await req.jwtVerify();
    const user: user_authData = (await req.jwtDecode()) as user_authData;
    if (!user.staff) return res.status(403).send({ logs: "Forbidden" });
    const eventId = req.body as eventBody;
    const eventInfos: eventQueryVerify = {
      slots: ((req.query as eventQueryVerify).slots as number) || "",
      status: ((req.query as eventQueryVerify).status as string) || "",
      latitude: ((req.query as eventQueryVerify).latitude as number) || "",
      longitude: ((req.query as eventQueryVerify).longitude as number) || "",
    };
    const objectVerify: objectReturnAdminUpdate | null =
      eventQueryVerify(eventInfos);
    if (!objectVerify)
      return res.status(400).send({ error: "No valid fields to update" });
    const result = await Orm_db.update({
      server: req.server,
      table_name: "events",
      colums_name: objectVerify?.columns_name || [],
      colums_values: objectVerify?.columns_values || [],
      condition: `WHERE id = "${eventId.eventId}"`,
    });
    if (result === -1) {
      return res.status(400).send({ error: "Event verification failed" });
    }
    return res.status(200).send({ logs: "adminEventVerify endpoint hit !" });
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
    if (!user.staff) return res.status(403).send({ logs: "Forbidden" });
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

export const eventAllCategories = async (
  req: FastifyRequest,
  resp: FastifyReply
) => {
  try {
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();
    console.log("getting categories of all events");
    const fetchedCategories = (await Orm_db.selection({
      server: req.server,
      table_name: "categories",
      colums_name: ["id", "category_name"],
      command_instraction: null,
    })) as { id: number; category_name: string }[];
    if (fetchedCategories.length === 0) {
      return resp.status(404).send({ message: "No categories found" });
    }
    console.log("Categories fetched successfully", fetchedCategories);
    return resp.status(200).send(fetchedCategories);
  } catch (error) {
    console.error("Thrown error --->", error);
    return resp.badRequest("Error in getting categories");
  }
};
