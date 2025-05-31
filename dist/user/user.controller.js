import { userAccountCreation } from "../utils/userCreation.js";
export const getUser = (req, resp) => {
    console.log("Request valid");
    resp.forbidden();
};
export const getUserData = async (req, resp) => {
    try {
        console.log(" -----< ", req.headers);
        await req.jwtVerify();
        const userData = await req.jwtDecode();
        const result = await userAccountCreation(req, userData);
        return resp.status(200).send(userData);
    }
    catch (e) {
        console.log(" ----<> catched Error", e);
        return resp.badRequest("Invalid User !");
    }
};
