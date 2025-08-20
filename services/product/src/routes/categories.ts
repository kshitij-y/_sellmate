import { Hono } from "hono";
import {
  getCategories,
  addCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/categories";

const catRouter = new Hono();

catRouter.get('/', getCategories);
catRouter.post("/", addCategories);
catRouter.delete("/", deleteCategory);
catRouter.put("/", updateCategory);

export default catRouter;