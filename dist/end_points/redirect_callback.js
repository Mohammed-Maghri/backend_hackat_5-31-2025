import { url } from "../controllers/srr_auth.js";
export const redirect_url = (instance) => {
    instance.route({
        method: "GET",
        url: "/redirect",
        // schema: {
        //   querystring: {
        //     type: "object",
        //     properties: {
        //       code: { type: "string" },
        //     },
        //     required: ["code"],
        //   },
        // },
        handler: url,
    });
};
