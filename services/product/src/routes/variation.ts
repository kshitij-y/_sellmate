import { Hono } from "hono";
import { getVariations, updateVariation, deleteVariation, addVariation } from "../controllers/variation";

const varRouter = new Hono();

varRouter.get("/", getVariations);
varRouter.post("/", addVariation);
varRouter.delete("/", deleteVariation);
varRouter.put("/", updateVariation);

export default varRouter;