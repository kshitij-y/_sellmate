import { Hono } from "hono";
import { createStore, deleteStore, getById, updateStore } from "../controller/store.controller.js";
const storeRoute = new Hono();


storeRoute.post("/createStore", createStore);
storeRoute.get("/getById", getById);
storeRoute.patch("/updateStore", updateStore);
storeRoute.delete("/deleteStore", deleteStore);


export default storeRoute;