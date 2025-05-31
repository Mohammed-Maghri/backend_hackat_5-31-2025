export const getUser = (req, resp) => {
    console.log("Request valid");
    resp.forbidden();
};
export const getUserData = async (req, resp) => {
    try {
        await req.jwtVerify();
        const userData = await req.jwtDecode();
        // const result = userAccountCreation(userData)
        return resp.status(200).send(userData);
    }
    catch (e) {
        console.log(" ----<> catched Error", e);
        return resp.badRequest("Invalid User !");
    }
};
