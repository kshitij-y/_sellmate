import { getDb } from "@sellmate/db";
import { Context } from "hono";
import { sendResponse } from "../utils/response";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const db = getDb();

export const addProduct = async () => {
    
}