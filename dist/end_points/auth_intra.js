import { auth_intra } from "../controllers/auth_intra.js";
export const Auth_intra = (server) => {
    server.route({
        method: "POST",
        url: "/auth/intra",
        // schema: {
        //   body : {
        //     type : 'object' ,
        //     properties : {
        //       code : {type : 'string'}
        //     },
        //     required : ['code']
        //   }
        // },
        handler: auth_intra,
    });
};
