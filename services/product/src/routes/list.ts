import { Hono } from "hono";
import {
  createListing,
  getListing,
  getSellerListings,
  updateListing,
  deleteListing,
} from "../controllers/list.js";



const listingRouter = new Hono();

// Create a new second-hand listing
listingRouter.post("/", createListing);

// Get all listings
listingRouter.get("/", getSellerListings);

// Get a single listing by ID
listingRouter.get("/:id", getListing);

// Update a listing by ID
listingRouter.patch("/:id", updateListing);

// Delete a listing by ID
listingRouter.delete("/:id", deleteListing);

export default listingRouter;