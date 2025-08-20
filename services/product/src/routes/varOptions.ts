import { Hono } from "hono";
import { getVariationOptions, updateVariationOption, deleteVariationOption, addVariationOption } from "../controllers/varOptions.js";

const varOptRouter = new Hono();

varOptRouter.get("/", getVariationOptions);
varOptRouter.post("/", addVariationOption);
varOptRouter.delete("/", deleteVariationOption);
varOptRouter.put("/", updateVariationOption);

export default varOptRouter;