import { Hono } from "hono";
import { getVariations } from "../controllers/variation";

const varRouter = new Hono();

varRouter.get("/:id", getVariations);

export default varRouter;