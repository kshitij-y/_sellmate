import { Hono } from "hono";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/profile.js";

const profileRouter = new Hono();

profileRouter.get("/", getUserProfile);
profileRouter.patch("/update", updateUserProfile);
export default profileRouter;
