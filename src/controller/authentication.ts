import express from "express";
import { ResponseModel } from "../output/response.model";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers/authentication";


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            const response = new ResponseModel(400, false, {});
            return res.send(response);
        }
        const isAlreadyAUser = await getUserByEmail(email)
        if (isAlreadyAUser) {
            const response = new ResponseModel(409, false, {});
            return res.send(response);
        }
        // random string of 128 bit
        const salt = random();
        const user = await createUser({ email, username, authentication: { salt, password: authentication(salt, password) } })
        const response = new ResponseModel(200, true, user);
        return res.send(response).end();
    }
    catch (error) {
        console.log(error);
        const response = new ResponseModel(400, false, error);
        return res.send(response);
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const response = new ResponseModel(400, false, { msg: "user not found" });
            return res.send(response);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        const expectedHash = await authentication(user?.authentication?.salt as any, password);
        if (!user) {
            const response = new ResponseModel(400, false, { msg: "user not found" });
            return res.send(response);
        }
        console.log(user.authentication?.salt);
        console.log(expectedHash);
        if (user.authentication?.password as any !== expectedHash) {
            const response = new ResponseModel(403, false, { msg: "password did't match" });
            return res.send(response);
        }
        const salt = random();
        user.authentication!.sessionToken = authentication(salt, user._id.toString()) as unknown as string;
        await user.save();
        res.cookie("AUTH_USER_BY_AUTH_USER",user.authentication?.sessionToken,{domain:"localhost",path:"/"})
        const response = new ResponseModel(200, true, user);
        return res.send(response);

    }
    catch (error) {
        console.log(error);
        const response = new ResponseModel(400, false, {});
        return res.send(response);
    }
}