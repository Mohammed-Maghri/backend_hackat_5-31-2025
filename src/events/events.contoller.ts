import { FastifyReply, FastifyRequest } from "fastify";
import { Orm_db } from "../orm.js";

interface queryObject {
  title: string | undefined;
  category_id: string | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  page: string | undefined;
}

const shouldSearch = (queryFilter: queryObject) => {
  let search_ToAppend = "";
  if (queryFilter.title !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `title == "${queryFilter.title}"`;
  }
  if (queryFilter.category_id !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `date == "${queryFilter.category_id}"`;
  }
  if (queryFilter.start_date !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `created_at >= "${queryFilter.start_date}"`;
  }
  if (queryFilter.end_date !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `date <= "${queryFilter.end_date}"`;
  }
  if (queryFilter.page !== "") {
    if (search_ToAppend !== "") search_ToAppend += " and ";
    search_ToAppend += `page == "${queryFilter.page}"`;
  }
  if (search_ToAppend !== "") {
    return `where ${search_ToAppend}`;
  } else return null;
};

const eventEndPoint = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const geterOject = req.query as queryObject;
    const queryFilter: queryObject = {
      title: (geterOject.title as string) || "",
      category_id: (geterOject.category_id as string) || "",
      start_date: (geterOject.start_date as string) || "",
      end_date: (geterOject.end_date as string) || "",
      page: (geterOject.page as string) || "",
    };
    // console.log(" ---> ", queryFilter);
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

export { eventEndPoint };
