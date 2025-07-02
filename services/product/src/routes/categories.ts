import { Hono } from "hono";
import { getCategories } from "../controllers/categories";

const catRouter = new Hono();

catRouter.get('/', getCategories);

export default catRouter;