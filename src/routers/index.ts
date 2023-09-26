import express from 'express';
import authenticaiton from './authenticaiton';

const router=express.Router();
export default ():express.Router=>{
    authenticaiton(router);
    return router;
}