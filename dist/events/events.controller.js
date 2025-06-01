import { Orm_db } from "../orm.js";
import { shouldSearch } from "../helpers/searchParser.js";
import { sendPushNotification } from "../utils/notificationSender.js";
export const eventCreation = async (req, resp) => {
    const eventData = req.body;
    try {
        await req.jwtVerify();
        const user = (await req.jwtDecode());
        const existingEvent = (await Orm_db.selection({
            server: req.server,
            table_name: "events",
            colums_name: ["id"],
            command_instraction: `WHERE title = '${eventData.title}' AND date = '${eventData.date}'`,
        }));
        if (existingEvent.length > 0) {
            return resp.badRequest("Event with the same title and date already exists.");
        }
        const userDbData = (await Orm_db.selection({
            server: req.server,
            table_name: "users",
            colums_name: ["*"],
            command_instraction: `WHERE login = '${user.login}'`,
        }));
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
        }));
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
        }));
        console.log(userTokens, "Tokens ------------------------");
        if (userTokens.length > 0) {
            for (const token of userTokens) {
                console.log("Sending notification to token:", token);
                await sendPushNotification(token, eventData);
            }
        }
        resp.status(200).send({ message: "/event endpoint hit" });
    }
    catch (e) {
        console.error("event Creation Failed");
        resp.status(400).send({ error: "Failed to insert event data" });
        return;
    }
};
const queryGetEventsWithAvatarPic = async (queryFilter, server) => {
    try {
        const search = shouldSearch(queryFilter);
        let query = "";
        if (search != null) {
            query = `SELECT events.*, users.images, users.login FROM events
    JOIN users ON events.creator_id = users.id ${search}`;
        }
        else {
            query = `SELECT events.*, users.images , users.login FROM events
    JOIN users ON events.creator_id = users.id`;
        }
        const searchResult = await server.db.all(query);
        return searchResult;
    }
    catch (error) {
        throw new Error("Error fetching events with avatar pictures");
    }
};
export const eventEndPoint = async (req, res) => {
    try {
        const geterOject = req.query;
        const queryFilter = {
            title: geterOject.title || "",
            category_id: geterOject.category_id || "",
            start_date: geterOject.start_date || "",
            end_date: geterOject.end_date || "",
            page: geterOject.page || "",
        };
        const events = await queryGetEventsWithAvatarPic(queryFilter, req.server);
        return res.status(200).send(events);
    }
    catch (e) {
        return res.status(400).send({ status: "Error !" });
    }
};
export const eventRegister = async (req, res) => {
    try {
        await req.jwtVerify();
        const user = (await req.jwtDecode()); // get user data from JWT
        const eventInfos = req.body;
        const eventData = (await Orm_db.selection({
            server: req.server,
            colums_name: ["slots"],
            table_name: "events",
            command_instraction: `WHERE id = "${eventInfos.eventId}"`,
        }));
        console.log("Event data: ", eventData);
        if (parseInt(eventData[0].slots) <= 0) {
            return res
                .status(400)
                .send({ error: "No slots available for this event" });
        }
        await Orm_db.update({
            server: req.server,
            table_name: "events",
            colums_name: ["slots"],
            colums_values: [parseInt(eventData[0].slots) - 1],
            condition: `WHERE id = "${eventInfos.eventId}"`,
        });
        const CheckingError = await Orm_db.insertion({
            server: req.server,
            table_name: "registrations",
            colums_name: ["user_id", "event_id"],
            colums_values: [user.id, eventInfos.eventId.toString()],
            command_instraction: null,
        });
        if (CheckingError === -1) {
            return res.status(400).send({ error: "Registration failed" });
        }
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).send({ error: "Unauthorized" });
    }
    res.status(200).send({ logs: "eventRegister endpoint hit !" });
};
export const eventUnregister = async (req, res) => {
    try {
        await req.jwtVerify();
        const user = (await req.jwtDecode());
        const eventInfos = req.body;
        const checkRegisterValidity = (await Orm_db.selection({
            server: req.server,
            table_name: "registrations",
            colums_name: ["*"],
            command_instraction: `WHERE user_id = "${user.id}" AND event_id = "${eventInfos.eventId}"`,
        }));
        if (checkRegisterValidity.length === 0) {
            return res.status(400).send({ error: "You are not registered for this event" });
        }
        console.log(" --------- --- ->< ", checkRegisterValidity);
        const eventData = (await Orm_db.selection({
            server: req.server,
            colums_name: ["slots"],
            table_name: "events",
            command_instraction: `WHERE id = "${eventInfos.eventId}"`,
        }));
        if (parseInt(eventData[0].slots) <= 0) {
            return res
                .status(400)
                .send({ error: "No slots available for this event" });
        }
        await Orm_db.update({
            server: req.server,
            table_name: "events",
            colums_name: ["slots"],
            colums_values: [parseInt(eventData[0].slots) + 1],
            condition: `WHERE id = "${eventInfos.eventId}"`,
        });
        const CheckingError = await Orm_db.deletion({
            server: req.server,
            table_name: "registrations",
            condition: `WHERE user_id = "${user.id}" AND event_id = "${eventInfos.eventId}"`,
        });
        if (CheckingError === -1) {
            return res.status(400).send({ error: "Registration deletion failed" });
        }
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).send({ error: "Unauthorized" });
    }
    res.status(200).send({ logs: "eventDelete endpoint hit !" });
};
const eventQueryVerify = (eventInfo) => {
    let colums_append_array = [];
    let colums_values_append_array = [];
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
        };
    }
    else
        return null;
};
export const adminEventVerify = async (req, res) => {
    try {
        await req.jwtVerify();
        const user = (await req.jwtDecode());
        if (!user.staff)
            return res.status(403).send({ logs: "Forbidden" });
        const eventId = req.body;
        const eventInfos = {
            slots: req.query.slots || "",
            status: req.query.status || "",
            latitude: req.query.latitude || "",
            longitude: req.query.longitude || "",
        };
        const objectVerify = eventQueryVerify(eventInfos);
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
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).send({ error: "Unauthorized" });
    }
};
export const adminListUnverifiedEvents = async (req, res) => {
    try {
        await req.jwtVerify();
        const user = (await req.jwtDecode());
        if (!user.staff)
            return res.status(403).send({ logs: "Forbidden" });
        const unverifiedEvents = await Orm_db.selection({
            server: req.server,
            table_name: "events",
            colums_name: ["*"],
            command_instraction: "WHERE status = 'pending'",
        });
        return res.status(200).send({ events: unverifiedEvents });
    }
    catch (err) {
        console.error("Error fetching unverified events:", err);
        return res.status(500).send({ error: "Failed to fetch unverified events" });
    }
};
export const eventAllCategories = async (req, resp) => {
    try {
        await req.jwtVerify();
        const userData = await req.jwtDecode();
        console.log("getting categories of all events");
        const fetchedCategories = (await Orm_db.selection({
            server: req.server,
            table_name: "categories",
            colums_name: ["id", "category_name"],
            command_instraction: null,
        }));
        if (fetchedCategories.length === 0) {
            return resp.status(404).send({ message: "No categories found" });
        }
        console.log("Categories fetched successfully", fetchedCategories);
        return resp.status(200).send(fetchedCategories);
    }
    catch (error) {
        console.error("Thrown error --->", error);
        return resp.badRequest("Error in getting categories");
    }
};
