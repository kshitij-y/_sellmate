import { Hono } from "hono";
import {
    getFullUserProfile,
    // addUserProfile,
    // updateUser,
    // updateUserProfile,
    updateUserAndProfile,
    getUserAddress,
} from "../controllers/profile.js";

const profileRouter = new Hono();

// Get full user + profile info
profileRouter.get("/", getFullUserProfile);

// Create user profile
// profileRouter.post("/", addUserProfile);

// Update basic user info (name, image)
profileRouter.patch("/update", updateUserAndProfile);

// Update user profile info (phone, address)
// profileRouter.patch("/profile", updateUserProfile);

//just to get address
profileRouter.get("/address", getUserAddress);

export default profileRouter;
