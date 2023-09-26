import express from "express";

import { login, register } from "../controller/authentication";

export default (router:express.Router)=>{
    router.post("/auth/register",register);
    router.post("/auth/login",login);
    router.get("/auth/test",(req,res)=>{res.send ("hello AWS")})
}